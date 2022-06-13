import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddStudentRequest } from '../models/api-models/add-student-request.model';
import { Student } from '../models/api-models/student.model';
import { UpadteStudentRequest } from '../models/api-models/update-student-request.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseApiUrl = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.baseApiUrl + '/students');
  }

  getStudent(studentId: string): Observable<Student>{
    return this.httpClient.get<Student>(this.baseApiUrl + '/students/' + studentId);
  }

  updateStudent(studentId: string, StudentRequest: Student): Observable<Student> {
    const updateStudentRequest: UpadteStudentRequest = {
      firstName: StudentRequest.firstName,
      lastName: StudentRequest.lastName,
      dateOfBirth: StudentRequest.dateOfBirth,
      email: StudentRequest.email,
      mobile: StudentRequest.mobile,
      genderId: StudentRequest.genderId,
      physicalAddress: StudentRequest.address.physicalAddress,
      postalAddress: StudentRequest.address.postalAddress
    }
    return this.httpClient.put<Student>(this.baseApiUrl + '/students/' + studentId, updateStudentRequest);
  }
  deleteStudent(studentId: string): Observable<Student>{
    return this.httpClient.delete<Student>(this.baseApiUrl + '/students/' + studentId);
  }
  addStudent(StudentRequest: Student): Observable<Student>{
    const addStudentRequest: AddStudentRequest = {
      firstName: StudentRequest.firstName,
      lastName: StudentRequest.lastName,
      dateOfBirth: StudentRequest.dateOfBirth,
      email: StudentRequest.email,
      mobile: StudentRequest.mobile,
      genderId: StudentRequest.genderId,
      physicalAddress: StudentRequest.address.physicalAddress,
      postalAddress: StudentRequest.address.postalAddress
    }
    return this.httpClient.post<Student>(this.baseApiUrl + '/students/add',addStudentRequest);
  }
  uploadImage(studentId: string, file: File): Observable<any>{
    const formData= new FormData();
    formData.append("profileImage", file);
    return this.httpClient.post(this.baseApiUrl + '/students/' + studentId + '/upload-image',
      formData, {
        responseType: 'text'
      });
  }
  getImagePath(relativePath: string){
    return `${this.baseApiUrl}/${relativePath}`;
  }
}
