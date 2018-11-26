import { Component, OnInit, OnChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'medical-modal',
  templateUrl: 'medical.modal.html',
  styleUrls: ['./medical.modal.css']
})
export class MedicalModal implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {}

  private questions = [
    {
      key: "q1",
      label: "The last time I had a medical check up was",
      value: "12/12/2018",
      type: "text",
      validation: { required: true }
    },
    {
      key: "q2",
      label: "Checked_yes ?",
      value: "Yes",
      type: "select",
      options: ['Yes', 'No'],
      validation: { required: true }
    }
  ];

  form: FormGroup;


  ngOnInit() {
    this.form = this.createGroup();

  }

  createGroup() {
    const group: any = {};

    this.questions.forEach(question => {
      group[question.key] = question.validation.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });

    return new FormGroup(group);
  }

  onSubmit(){
    console.log('this.form',this.form);
  }
}