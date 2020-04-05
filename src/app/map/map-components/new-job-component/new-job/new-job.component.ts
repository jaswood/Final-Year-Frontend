import { Component, OnInit, Output, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TradeType } from 'src/app/enums/trade-types';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user.model';
import { Subscription } from 'rxjs';
import { PostcodeService } from 'src/app/services/postcode.service';
import { Job } from 'src/app/models/job';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { BlobLocations } from 'src/app/enums/blob-locations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit, OnDestroy {
  @Output() dismiss = new EventEmitter<boolean>();
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  private userSub: Subscription;

  minimunPrice = 50;
  maxDesicriptionLength = 300;
  maxTitleLength = 30
  minPostcodeLength = 6;
  maxPostcodeLength = 8;
  customErrorText = '';

  trades = Object.values(TradeType);
  user: User;
  file: File;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(this.maxTitleLength)]),
    postcode: new FormControl('', [Validators.required, Validators.maxLength(this.maxPostcodeLength), Validators.minLength(this.minPostcodeLength)]),
    tradeType: new FormControl('', Validators.required),
    budget: new FormControl('', [Validators.required, Validators.min(this.minimunPrice)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(this.maxDesicriptionLength)])
  });

  newJob: Job = new Job();
  postcodeInvalid: boolean;
  uploadError: boolean;

  constructor(
    public authService: AuthService,
    private postcodeService: PostcodeService,
    public fileUploadService: FileUploadService,
    private jobsService: JobsService
  ) { }

  ngOnInit(): void {
    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        this.newJob.issueUid = user.uid;
      });
    }
  }

  postcodeChange() {
    this.postcodeInvalid = false;
  }

  submit() {
    var self = this;
    this.postcodeService.convertPostcodeToLatLong(this.form.get('postcode').value).subscribe(
      (data) => {
        let lat = ((data as any).result.latitude);
        let lng = ((data as any).result.longitude);
        this.newJob.lngLat = { lat, lng }

        if (this.file) {
          this.fileUploadService.uploadFile(this.file, BlobLocations.jobPostingImages, function (result) {
            if (result === 'error') {
              console.log('there was an error with the upload');
              self.customErrorText = "Problem with Image Upload";
              self.uploadError = true;
            }
            else {
              self.newJob.picture = result;
              self.jobsService.uploadNewJob(self.newJob);
            }
          });
        } else {
          this.jobsService.uploadNewJob(this.newJob);
        }
      },
      (error) => this.errorHandler(error)
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  errorHandler(error) {
    if (error.error.error == 'Invalid postcode') {
      this.postcodeInvalid = true;
      this.customErrorText = 'Invalid Postcode';
    }
    console.log("oops", error);
  }

  dismissComponent() {
    this.dismiss.emit(true);
  }

  onClick() {
    this.uploadError = false;
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.file = fileUpload.files;
    };
    fileUpload.click();
  }
}
