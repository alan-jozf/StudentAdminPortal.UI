import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string| null |undefined;
  student: Student={
    id:'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile: 0,
    genderId:'',
    profileImageUrl:'',
    gender:{
      id:'',
      description:''
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }
  }
  isNewStudent= false;
  header='';
  displayProfileImageUrl='';
  genderList: Gender[] =[];

  constructor(private readonly studentService: StudentService,
    private readonly route : ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router  ){ }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId =params.get('id');

        if(this.studentId){
          //   if the route contains the 'Add'
          if (this.studentId.toLocaleLowerCase()=== 'Add'.toLocaleLowerCase()) {
            //-> new student functionality
            this.isNewStudent= true;
            this.header= 'Add New Student';
            this.setImage();
          }
          //   otherwise
          else{
            //-> existing student functinality
            this.isNewStudent= false;
            this.header= 'Edit Student';
            this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) =>{
                this.student= successResponse;
                this.setImage();
              },
              (errorResponse) =>{
                this.setImage();
              }
            );
          }

          this.genderService.getGendeList()
          .subscribe(
            (successResponse) => {
              this.genderList = successResponse;
            }
          );
        }
      }
    );
  }
  onUpdate(): void{
    // console.log(this.student);
    // call student service to update student
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      (successResponse) => {
        // console.log(successResponse)
        this.snackbar.open('Student Updated Successfully',undefined,{
          duration: 2000
        });
      },
      (errorResponse) => {
        //log it
      }
    );
  }
  onDelete(): void{
    // console.log(this.student);
    // call student service to delete student
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (successResponse) => {
        // console.log(successResponse)
        this.snackbar.open('Student Deleted Successfully',undefined,{
          duration: 2000
        });
        setTimeout(()=> {
          this.router.navigateByUrl('students')
        }, 2000);
      },
      (errorResponse) => {
        //log it
      }
    );
  }
  onAdd():void{
    this.studentService.addStudent(this.student)
    .subscribe(
    (successResponse) => {
      // console.log(successResponse)
      this.snackbar.open('Student Added Successfully',undefined,{
        duration: 2000
      });
      setTimeout(()=> {
        this.router.navigateByUrl(`students/${successResponse.id}`)
      }, 2000);
    },
    (errorResponse)=>{
      //log
    }
    );
  }
  uploadImage(event: any): void{
    if(this.studentId){
      const file: File= event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse)=>{
          this.student.profileImageUrl = successResponse;
          this.setImage();

          this.snackbar.open('Profile Image Updated',undefined,{
            duration: 2000
          });
        },
        (errorResponse) =>{

        }
      );
    }
  }
  private setImage(): void{
    if (this.student.profileImageUrl) {
      // fetch the image by url
      this.displayProfileImageUrl= this.studentService.getImagePath(this.student.profileImageUrl);
    }
    else{
      // display a default
      this.displayProfileImageUrl='/assets/user.png';
    }
  }
}
