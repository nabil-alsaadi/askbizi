import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormValidators, SubSink, ViewState, ViewStateSubject } from 'ng-soapy-lib';
import { BehaviorSubject, catchError, EMPTY, of, switchMap, take } from 'rxjs';
import { BusinessService } from 'soapy-types';
import { BusinessServicesService } from './services/business-services.service';
import { BusinessSetupService } from './services/business-setup.service';
import { ContactService } from './services/contact-service.service';
import { InquiriesService } from './services/inquiries-service.service';

interface State extends ViewState {
  inqFormLoading: boolean;
  inqFormError: string | null;
  contactFormLoading: boolean,
  contactFormError: string | null;
}
export type InquiryParams = {
  name: string;
  email: string;
  phone: string;
  note: string;
  service: string;
};
export type ContactParams = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  subs = new SubSink();
  constructor(private fb: FormBuilder,
    public businessSetupService: BusinessSetupService, 
    public businessServicesService: BusinessServicesService,
    public inquiriesService: InquiriesService,
    public contactService: ContactService,
    public snackBarService: MatSnackBar,
    ) {}

  initialState: State = {
    loading: true,
    error: '',
    inqFormLoading: false,
    inqFormError: null,
    contactFormLoading: false,
    contactFormError: null
  };

  state$ = new ViewStateSubject(this.initialState);

  businessSetup$ = new BehaviorSubject<Partial<BusinessService>[] | undefined>(undefined);
  businessServices$ = new BehaviorSubject<Partial<BusinessService>[] | undefined>(undefined);

  formGroup = this.fb.group({
    inqName: [null, [Validators.required]],
    inqEmail: [null, [Validators.required, Validators.email]],
    inqPhone: [null, [Validators.required,FormValidators.e164PhoneNumber()]],
    inqService: [null, [Validators.required]],
    inqNote: [null]
  });

  contactFormGroup = this.fb.group({
    cntName: [null, [Validators.required]],
    cntEmail: [null, [Validators.required, Validators.email]],
    cntPhone: [null, [Validators.required,FormValidators.e164PhoneNumber()]],
    cntMsg: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.subs.sink = this.businessSetupService.data().subscribe(this.businessSetup$)
    this.subs.sink = this.businessServicesService.data().subscribe(this.businessServices$)
    console.log('')
  }
  handleContactFormSubmit($event: MouseEvent) {
    // this.openSnackBar('Inquiry have been create, we will contact you soon');
    $event.preventDefault();
    if (this.contactFormGroup.invalid) return;
    this.contactFormGroup.disable({ emitEvent: false });
    console.log('formGroup',this.contactFormGroup.value)
    console.log('this.formGroup.value.inqName',this.contactFormGroup.value.cntName)
    this.state$.set({ contactFormLoading: true, contactFormError: null });
    // this.inquiriesService.create()
    const params: ContactParams = {
      name: this.contactFormGroup.value.cntName,
      email: this.contactFormGroup.value.cntEmail,
      phone: this.contactFormGroup.value.cntPhone,
      message: this.contactFormGroup.value.cntMsg,
    };
    console.log('InquiryParams =========',params)
    this.subs.sink = this.contactService.create(params,false).subscribe({
      next: async (res) => {
        this.state$.set({
          contactFormLoading: false,
          contactFormError: null
        });
        this.contactFormGroup.enable({ emitEvent: false });
        this.contactFormGroup.reset(undefined, { emitEvent: false });
        console.log('inqury created')
        // this.openSnackBar('Inquiry have been create, we will contact you soon');
        window.alert('Inquiry have been create, we will contact you soon');
      },
      error: (error) => {
        console.log('error',error)
          this.state$.set({
            contactFormLoading: false,
            contactFormError: error ?? 'something wrong please try again later'
          });
          this.contactFormGroup.enable({ emitEvent: false });
      }
    });
  }
  handleFormSubmit($event: MouseEvent) {
    // this.openSnackBar('Inquiry have been create, we will contact you soon');
    $event.preventDefault();
    if (this.formGroup.invalid) return;
    this.formGroup.disable({ emitEvent: false });
    console.log('formGroup',this.formGroup.value)
    console.log('this.formGroup.value.inqName',this.formGroup.value.inqName)
    this.state$.set({ inqFormLoading: true, inqFormError: null });
    // this.inquiriesService.create()
    const params: InquiryParams = {
      name: this.formGroup.value.inqName,
      email: this.formGroup.value.inqEmail,
      phone: this.formGroup.value.inqPhone,
      note: this.formGroup.value.inqNote,
      service: this.formGroup.value.inqService
      // itemTypeId: this.formGroup.value.itemType?.uid
    };
    console.log('InquiryParams =========',params)
    this.subs.sink = this.inquiriesService.create(params,false).subscribe({
      next: async (res) => {
        this.state$.set({
          inqFormLoading: false,
          inqFormError: null
        });
        this.formGroup.enable({ emitEvent: false });
        this.formGroup.reset(undefined, { emitEvent: false });
        console.log('inqury created')
        // this.openSnackBar('Inquiry have been create, we will contact you soon');
        window.alert('Inquiry have been create, we will contact you soon');
      },
      error: (error) => {
        console.log('error',error)
          this.state$.set({
            inqFormLoading: false,
            inqFormError: error ?? 'something wrong please try again later'
          });
          this.formGroup.enable({ emitEvent: false });
      }
    });

    // this.subs.sink = of(null)
    //   .pipe(
    //     switchMap(() => {
          
    //       const params: InquiryParams = {
    //         name: this.formGroup.value.inqName,
    //         email: this.formGroup.value.inqEmail,
    //         phone: this.formGroup.value.inqPhone,
    //         note: this.formGroup.value.inqNote,
    //         service: this.formGroup.value.inqService
    //         // itemTypeId: this.formGroup.value.itemType?.uid
    //       };
    //       return this.inquiriesService.create(params,false);
    //     }),
    //     // take(1),
    //     switchMap(() => {
    //       this.state$.set({
    //         inqFormLoading: false,
    //         inqFormError: null
    //       });
    //       this.formGroup.enable({ emitEvent: false });
    //       this.formGroup.reset(undefined, { emitEvent: false });
    //       console.log('inqury created')
    //       //this.openSnackBar('Item created');
    //       // this.dialogRef.close();
    //       return EMPTY;
    //     }),
    //     catchError(({ error }) => {
    //       console.log('error',error)
    //       this.state$.set({
    //         inqFormLoading: false,
    //         inqFormError: error ?? 'something wrong please try again later'
    //       });
    //       this.formGroup.enable({ emitEvent: false });
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openSnackBar(message: string) {
    this.snackBarService.open(message, undefined, { duration: 100000 ,horizontalPosition: "center",
    verticalPosition: "top",});
  }
  bsModalShow = false
  modalService: Partial<BusinessService> = {}
  //bsModalProps:ModalProps = {'class': "portfolio-modal modal fade",'style':{'display':'none'},'service':{}};
  
  openPopup(service:Partial<BusinessService>) {
    this.bsModalShow = true
    this.modalService = service
    //this.bsModalProps = {'class': "portfolio-modal modal fade show",'style':{'display':'block'},'service':service};
  }
  closePopup() {
    this.bsModalShow = false
    //this.bsModalProps = {'class': "portfolio-modal modal fade",'style':{'display':'none'},'service':{}};
  }
  goToInquiry() {
    this.bsModalShow = false
    window.location.href = '#inquiry'
    console.log('window.location.href =',window.location.href)
    //this.bsModalProps = {'class': "portfolio-modal modal fade",'style':{'display':'none'},'service':{}};
  }
}
interface ModalProps {
  class: string;
  style: {display: string}
  bodyStyle: {class:string}
  service: Partial<BusinessService>
}
//class="modal-open"
//overflow: hidden; padding-right: 0px;