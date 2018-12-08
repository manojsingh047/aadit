import { Component, OnInit, OnChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicFormModel } from 'src/app/models/dynamic-form.model';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { SheetTabsTitleConst } from '../../constants/sheet.constant';
import { DriveRequestModel } from 'src/app/models/drive-postdata.model';

@Component({
  selector: 'medical-modal',
  templateUrl: 'medical.modal.html',
  styleUrls: ['./medical.modal.css']
})
export class MedicalModal implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private googleDriveService: GoogleDriveService
  ) { }

  // private questions = [
  //   {
  //     key: 'q1',
  //     label: 'The last time I had a medical check up was',
  //     value: '12/12/2018',
  //     type: 'text',
  //     validation: { required: true }
  //   },
  //   {
  //     key: 'q2',
  //     label: 'Checked_yes ?',
  //     value: 'Yes',
  //     type: 'select',
  //     options: ['Yes', 'No'],
  //     validation: { required: true }
  //   }
  // ];

  private questions: DynamicFormModel[];
  private form: FormGroup;


  ngOnInit() {

    console.log(this.googleDriveService.getLocalSheetTabData(SheetTabsTitleConst.MEDICAL_HISTORY));

    const questionsData = this.googleDriveService.getLocalSheetTabData(SheetTabsTitleConst.MEDICAL_HISTORY).data.values;

    this.questions = this.getQuestions(questionsData);

    this.form = this.createGroup();

  }

  private getQuestions(questionsData): DynamicFormModel[] {

    let questions = [];

    for (let i = 1; i < questionsData.length; i++) {
      const element = questionsData[i];

      questions.push({
        key: element[0],
        label: element[1],
        value: element[2],
        type: element[3],
        options: element[4] ? element[4].split(',') : [],
        validations: { required: true }
      });
    }

    return questions;
  }

  createGroup() {
    const group: any = {};

    this.questions.forEach(question => {
      group[question.key] = question.validations.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });

    return new FormGroup(group);
  }

  onSubmit() {
    const postData: DriveRequestModel = this.getParsedPostData(this.form.value);

    this.googleDriveService.setAllSheetData(this.googleDriveService.getSheetId(), postData).subscribe();
  }

  private getParsedPostData(formData): DriveRequestModel {

    console.log(formData);
    const values = [];

    Object.values(formData).forEach(value => {
      values.push(value);
    });

    const postData: DriveRequestModel = {
      'valueInputOption': 'USER_ENTERED',
      'data': [{
        'range': `${SheetTabsTitleConst.MEDICAL_HISTORY}!C2:C4`,
        'majorDimension': 'COLUMNS',
        'values': [values]
      }]
    };

    console.log('postData', postData);
    return postData;

  }
}