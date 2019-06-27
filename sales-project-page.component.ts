import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin as observableForkJoin, Observable } from 'rxjs';

import RestApiHelper from './rest-api-helper';
import SalesProject from './sales-project.model';
import SalesProjectService from './sales-project.service';


@Component({
  moduleId: module.id,
  selector: 'app-sales-project-page',
  templateUrl: './sales-project-page.component.html',
  styleUrls: ['./sales-project-page.component.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})

/**
 * @class  SalesProjectPageComponent
 * @classdesc Represents a component for a SalesProject detail page.
 */

// Could be extended from some abstract component class
// export class SalesProjectPageComponent extends AbstractSaleProjPageComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit, ICanDeactivateComponent {
export class SalesProjectPageComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  /** Represents whether the <i>delete all LeadOffers</i> button is visible or not. */
  canDeleteLeadOffers = false;

  /**
   * @constructs SalesProjectPageComponent
   */
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected route: ActivatedRoute,
    private router: Router,
    protected salesProjectService: SalesProjectService,
  ) {  }

  // --------------- Interfaces ---------------

  ngOnInit(): void {
    this._updateCanDeleteLeadOffers();
  }

  // --------------- Private ---------------

  private _updateCanDeleteLeadOffers(): void {
    
  }


  // --------------- Overwrite (AbstractSalesProjectPageComponent) ---------------


  // --------------- Private (Backend Communication) --------------- 

  /**
   * Loads a SalesProject by a given identifier.
   * @param salesProjectId A SalesProject's identifier
   */
  private _getSalesProjectById(salesProjectId: string): Observable<SalesProject> {

    const observable$ = this.salesProjectService.getSalesProjectById(salesProjectId);
    const subscription$ = observable$.subscribe(
      salesProject => {
        RestApiHelper.cancelSubscription(subscription$);
      },
      (httpErrorResponse: HttpErrorResponse) => this._onHttpError(
        httpErrorResponse,
        subscription$,
        `Fehler Laden des Verkaufsprojekts`,
        'Die Daten konnten leider nicht geladen werden. Bitte versuchen Sie es erneut.'
      )
    );

    return observable$;
  }

  // --------------- Public Accessors ---------------

  /**
   * Returns whether the page's form is editedable or not.
   */
  get disabled(): boolean {
    return this.salesProject.isApproved || this.salesProject.isExported || this.salesProject.isOrdered;
  }

  /**
   * Returns whether a SalesProject can be exported to PCL or not.
   * To be able to export a project, a LeadOffer needs to be selected first.
   */
  canBeExported(): boolean {
    return this.offerId &&
      !this.salesProject.isExported &&
      !this.salesProject.isOrdered &&
      !this.salesProject.isApproved;
  }

  // --------------- Public UI ---------------

  /**
   * Handles events to delete a specific LeadOffer.
   * @param event An Event
   * @param leadOfferOverview A LeadOfferOverview instance
   */
  onClickDeleteLeadOffer(event: Event, leadOfferOverview: LeadOfferOverview): void {
    if (leadOfferOverview) {
      const alertDialog = new AlertDialog(
        this.getModalDialogLevel(),
        `Möchten Sie das ${FileName.OFFER} <i>${leadOfferOverview.offerId}</i> wirklich endgültig löschen?`,
        'Diese Aktion kann nicht widerrufen werden.',
        () => {
          this._deleteLeadOffer(leadOfferOverview);
          this._handleAlertCancel(alertDialog);
        },
        () => this._handleAlertCancel(alertDialog)
      );

      alertDialog.submitButtonLabel = AlertDialogButtonLabel.DELETE;
      this.focusManagerService.add(event.currentTarget as HTMLElement);
      this.modalDialogService.push(alertDialog);
    }
  }

  /**
   * Handles events to delete all LeadOffers in a SalesProject, that have not been ordered.
   * @param event An Event
   * @param salesOverview A SalesOverview instance
   */
  onClickDeleteLeadOffers(event: Event, salesOverview: SalesOverview): void {
    const offerIds: string[] = [];

    salesOverview.leadOfferOverviews.forEach(leadOfferOverview => {
      if (this.canDeleteLeadOffer(leadOfferOverview)) {
        offerIds.push(leadOfferOverview.offerId);
      }
    });

    if (offerIds.length > 0) {
      const alertDialog = new AlertDialog(
        this.getModalDialogLevel(),
        'Möchten Sie die folgenden ${FileName.OFFER}e wirklich endgültig löschen?',
        `<ul role="list"><li role="listitem">${offerIds.join('</li><li>')}</li></ul>Diese Aktion kann nicht widerrufen werden.`,
        () => {
          this._deleteLeadOffers(salesOverview);
          this._handleAlertCancel(alertDialog);
        },
        () => this._handleAlertCancel(alertDialog)
      );

      alertDialog.submitButtonLabel = AlertDialogButtonLabel.DELETE;
      this.focusManagerService.add(event.currentTarget as HTMLElement);
      this.modalDialogService.push(alertDialog);
    }
  }

  /**
   * Handles events to delete a SalesProject, that does not contain any LeadOffers.
   * @param event An Event
   * @param salesOverview A SalesOverview instance
   */
  onClickDeleteSalesProject(event: Event, salesOverview: SalesOverview): void {
    if (salesOverview) {
      const alertDialog = new AlertDialog(
        this.getModalDialogLevel(),
        `Möchten Sie das Projekt <i>${salesOverview.projectName}</i> wirklich endgültig löschen?`,
        'Diese Aktion kann nicht widerrufen werden.',
        () => {
          this._deleteSalesProject(salesOverview);
          this._handleAlertCancel(alertDialog);
        },
        () => this._handleAlertCancel(alertDialog)
      );

      alertDialog.submitButtonLabel = AlertDialogButtonLabel.DELETE;
      this.focusManagerService.add(event.currentTarget as HTMLElement);
      this.modalDialogService.push(alertDialog);
    }
  }

  /**
   * Handles exporting a SalesProject.
   */
  onClickExportSalesProject(event: Event, salesProject: SalesProject): void {
    if (this.canBeExported()) {
      const captcha = 'export';
      const captchaDialog = new CaptchaDialog(
        this.getModalDialogLevel(),
        `Möchten Sie das Projekt <i>${salesProject.projectName}</i> wirklich exportieren?`,
        `Diese Aktion kann nicht widerrufen werden. Zur Bestätigung geben Sie bitte das Wort "${captcha}" ein (ohne Anführungszeichen, Groß-/Kleinschreibung beachten).`,
        captcha,
        () => {
          this._generateRoutingSheetJSON(salesProject, this.offerId);
          this._handleAlertCancel(captchaDialog);
        },
        () => this._handleAlertCancel(captchaDialog)
      );

      // captchaDialog.submitButtonLabel = AlertDialogButtonLabel.DELETE;
      this.focusManagerService.add(event.currentTarget as HTMLElement);
      this.modalDialogService.push(captchaDialog);
    }
  }
}
