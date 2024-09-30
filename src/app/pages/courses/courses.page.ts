import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { StateService } from 'src/app/services/state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  p: number = 1;
  courses;
  searchValue = '';
  searching = false;
  pageNumber = 1;
  pageSize = 6;
  totalRecords = 0;
  searchTimeout;
// test=[
//   {
//       "id": 37,
//       "name": "Anti-Money Laundering (AML)",
//       "description": "Learn more about the money laundering, its stages and how to avoid it.",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9MzcmbWVkaWFOYW1lPWFudGlfbW9uZXlfbGF1bmRlcmluZzJfMjAyNDA4MjdfMTIxMjMxLmpwZyZjb250ZW50VHlwZT1pbWFnZS9qcGVn",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 2,
//           "name": "Beginner"
//       },
//       "subCategory": {
//           "id": 3,
//           "name": "Policies",
//           "categoryId": 2,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   },
//   {
//       "id": 39,
//       "name": "Managing Difficult Personalities",
//       "description": "Learn the diffirent types of personalities and how to manage and deal with the difficult ones.",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9MzkmbWVkaWFOYW1lPVRodW1wbmFpbF8yMDI0MDgyOF8xNjUyNTMucG5nJmNvbnRlbnRUeXBlPWltYWdlL3BuZw==",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 1,
//           "name": "Advanced"
//       },
//       "subCategory": {
//           "id": 4,
//           "name": "Skills for Tomorrow",
//           "categoryId": 3,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   },
//   {
//       "id": 38,
//       "name": "7 Habits for Success",
//       "description": "Learn the 7 common habits that most successful people do to maintain their success.",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9MzgmbWVkaWFOYW1lPVRodW1wbmFpbF8yMDI0MDgyOF8xNjI0NTQucG5nJmNvbnRlbnRUeXBlPWltYWdlL3BuZw==",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 1,
//           "name": "Advanced"
//       },
//       "subCategory": {
//           "id": 4,
//           "name": "Skills for Tomorrow",
//           "categoryId": 3,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   },
//   {
//       "id": 40,
//       "name": "Personal Branding",
//       "description": "Learn how to build your personal branding.",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9NDAmbWVkaWFOYW1lPVRodW1wbmFpbF8yMDI0MDgyOF8xNzA3MjMucG5nJmNvbnRlbnRUeXBlPWltYWdlL3BuZw==",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 1,
//           "name": "Advanced"
//       },
//       "subCategory": {
//           "id": 4,
//           "name": "Skills for Tomorrow",
//           "categoryId": 3,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   },
//   {
//       "id": 41,
//       "name": "Galaxy A05s",
//       "description": "Learn the specs & offers of the new Flexawya mobile (Galaxy A05s)",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9NDEmbWVkaWFOYW1lPXRodW1wbmFpbCBmb3Igdl8yMDI0MDkwMV8xMzQwMDgucG5nJmNvbnRlbnRUeXBlPWltYWdlL3BuZw==",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 1,
//           "name": "Advanced"
//       },
//       "subCategory": {
//           "id": 5,
//           "name": "Product Knowledge",
//           "categoryId": 3,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   },
//   {
//       "id": 28,
//       "name": "Power of Conflict",
//       "description": "Learn the different types of conflicts, how to manage it and resolve it professionally.",
//       "isPublished": true,
//       "cover": "/api/v1/CourseContents/RetrieveMediaFile?content=Y291cnNlSWQ9MjgmbWVkaWFOYW1lPTIzLU1LVEctMDUzOC1CR0NBLUNvbmZsaWN0X2RvbmF0ZS01Xzk0NXg2MjVfMjAyNDAxMTRfMTQzMzMzLmpwZyZjb250ZW50VHlwZT1pbWFnZS9qcGVn",
//       "url": null,
//       "courseType": {
//           "id": 2,
//           "name": "Training Video"
//       },
//       "skillLevel": {
//           "id": 2,
//           "name": "Beginner"
//       },
//       "subCategory": {
//           "id": 2,
//           "name": "Expert Resolution",
//           "categoryId": 2,
//           "categoryName": null
//       },
//       "mode": {
//           "id": 3,
//           "name": "Self-Learning"
//       },
//       "applyPrerequisite": true,
//       "isPublic": true
//   }
// ]
  coursesTypes = [
    {name: 'Public Courses', id: 1},
    {name: 'Assigned Courses', id: 2},
    {name: 'Enrolled-in Courses', id: 3},
  ]
  selectedCoursesType=1;
  isAdmin = false;
  categories = [];
  selectedCategory: any;
  subCategories = [];
  selectedSubCategories = [];
  learningModes = [];
  selectedLearningModes = [];
  skillLevels = [];
  selectedSkillLevels = [];
  courseTypes = [];
  selectedCourseTypes = [];
  public environment = environment;
  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private stateService: StateService,
    private dataService: DataService,) { }
  ngOnInit(): void {
    // this.isAdmin = this.stateService.isAdmin.getValue();
// console.log("ok")
    this.getCourses();
    this.getAllCategories();
    this.getAllCourseTypes();
    this.getAllLearningModes();
    this.getAllSkillLevels();
  }

  onCourseTypeChange() {
    this.pageNumber = 1;
    this.totalRecords = 0;
    this.courses = [];
    this.getCourses();
  }

  setSubCategories() {
    // reset selected sub category on category change
    this.selectedSubCategories = [];
    this.subCategories = this.selectedCategory?.subCategories;
    if (!this.selectedCategory) {
      this.filterCourses();
    }

  }
  getAllCategories() {
    const dataName = this.isAdmin ? 'v1/Categories' : 'v1/Categories'
    this.dataService.getFieldData(this.isAdmin, dataName).subscribe(
      (res: any) => {
        this.categories = res.result;
      }
    )
  }
  getAllSkillLevels() {
    const dataName = this.isAdmin ? 'v1/SkillLevels' : 'v1/SkillLevels'
    this.dataService.getFieldData(this.isAdmin, dataName).subscribe(
      (res: any) => {
        this.skillLevels = res.result;
      }
    )
  }
  getAllLearningModes() {
  const dataName = this.isAdmin ? 'v1/Modes' : 'v2/Modes'
  this.dataService.getFieldData(this.isAdmin, dataName).subscribe(
      (res: any) => {
        this.learningModes = res.result;
      }
    )
  }
  getAllCourseTypes() {
  const dataName = this.isAdmin ? 'v1/CourseTypes' : 'v1/CourseTypes'
  this.dataService.getFieldData(this.isAdmin, dataName).subscribe(
      (res: any) => {
        this.courseTypes = res.result;
      }
    )
  }

  replaceMediaUrl(courses) {
    this.courses = courses.map(course => {
      // course.cover = course.cover?.replace('https://10.230.196.101:623', 'https://v.library.academy.vodafone.com.eg/Admin');
      // course.cover = course.cover?.replace('https://10.230.196.101:903', 'https://v.library.academy.vodafone.com.eg/Web');
      // if (this.stateService.isAdmin.getValue()) {
      //   course.cover = course.cover ? environment.admin_api_url_prefix + course.cover : null;
      // } else {
        course.cover = course.cover ? environment.user_api_url_prefix + course.cover : null;
      // }
      return course;
    })
  }

  getCourses() {

    this.resetFilters();
    this.searchValue = '';
    let params = [
      {key: 'PageNumber', value: this.pageNumber},
      {key: 'PageSize', value: this.pageSize},
    ]
    if (!this.isAdmin) {
      params.push(
        {key: 'classification', value: this.selectedCoursesType},
      )
    }
    // console.log(params);

    const dataName = this.isAdmin ? 'v1/Courses/FilterCourses' : 'v2/Courses/CoursesByUserId';
    // console.log(dataName);
    this.dataService.addFieldData(this.isAdmin, dataName, {}, params).subscribe(
      (res: any) => {
        this.stateService.$coursesType.next(this.selectedCoursesType)
        // console.log(res);
        this.totalRecords = this.isAdmin ? res.totalCount : res.count;
        this.courses = res.result;
        this.replaceMediaUrl(this.courses);
        this.stateService.$courses.next(this.courses);
      }
    );
  }

  searchCourses() {
    this.pageNumber = 1;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      let params = [
        {key: 'PageNumber', value: this.pageNumber},
        {key: 'PageSize', value: this.pageSize},
      ];
      if (!this.isAdmin) {
        params.push(
          {key: 'classification', value: this.selectedCoursesType},
        )
      }
      this.resetFilters();
      this.searching = true;

      const dataName = this.isAdmin ? 'v1/Courses/FilterCourses' : 'v2/Courses/CoursesByUserId'
      this.dataService.addFieldData(this.isAdmin, dataName, {name: this.searchValue}, params).subscribe(
        (res: any) => {
          // console.log(res);
          this.totalRecords = this.isAdmin ? res.totalCount : res.count;
          this.courses = res.result;
          this.replaceMediaUrl(this.courses);
          this.searching = false;
        }, err => {this.searching = false;}
      );
    }, 1000)
  }

  filterCourses() {
    // console.log(this.selectedCategory);

    let params = [
      {key: 'PageNumber', value: this.pageNumber},
      {key: 'PageSize', value: this.pageSize},
    ]
    if (!this.isAdmin) {
      params.push(
        {key: 'classification', value: this.selectedCoursesType},
      )
    }
    let body = {
      name: this.searchValue,
      subCategories: this.selectedSubCategories,
      modes: this.selectedLearningModes,
      courseType: this.selectedCourseTypes,
      skillLevel: this.selectedSkillLevels
    }
    // console.log(body);
    this.searching = true;
    const dataName = this.isAdmin ? 'v1/Courses/FilterCourses' : 'v2/Courses/CoursesByUserId'
    this.dataService.addFieldData(this.isAdmin, dataName, body, params).subscribe(
      (res: any) => {
        // console.log(res);
        this.totalRecords = this.isAdmin ? res.totalCount : res.count;
        this.courses = res.result;
        this.replaceMediaUrl(this.courses);
        this.searching = false;
      }, err => {this.searching = false;}
    );
  }

  paginate(e) {
    console.log(e);
    this.pageNumber = e;
    // this.pageSize = e.rows;
    this.filterCourses();
  }

  resetFilters() {
    this.selectedLearningModes = [];
    this.selectedSubCategories = [];
    this.selectedCourseTypes = [];
    this.selectedSkillLevels = [];
  }

  navigateToCourse(course) {
    this.router.navigate(
      [course.id],
      { relativeTo: this.activatedRoute }
    );
  }

  changeActiveStatus(e, course) {
    e.stopPropagation();
    let value = course.isPublished ? false : true;
    // console.log(value);

    this.dataService.getFieldDataById(true, 'v1/Courses', course.id).subscribe((res: any) => {
      // console.log(res);

      let chapters = res.courseChapters;
      let chaptersOrders = [];
      let lastContentId = null;

      if (chapters?.length > 0) {
        chapters.forEach((ch, chIndex) => {
          let contents = [];
          ch.courseContents.forEach((content, contentIndex) => {
            contents.push({id: content.id, order: contentIndex + 1})
            lastContentId = content.id;
          })
          chaptersOrders.push({
            id: ch.id,
            order: chIndex + 1,
            contents
          })
        });
      }
      if (!lastContentId) {
        // this.showToastService.showToast('warning', 'Something went wrong!', `You cannot publish a course that has no contents`);
        // handle reseting the swich
        this.courses.splice(
          this.courses.indexOf(this.courses.find(c => c.id == course.id)), 1, {...course}
        );
        return;
      }
      let body = {
        id: course.id,
        isPublished: value,
        lastContentId: lastContentId,
        chapters: chaptersOrders,
      }
      // console.log(body);
      this.dataService.updateFieldData(true, 'v1/Courses', body).subscribe(res => {
        // console.log(res);
        // this.showToastService.showToast('success', 'Updated Successfully', `'${course.name}' Course is now ${value ? 'Published' : 'Unpublished'}`);
        this.courses.find(c => c.id == course.id).isPublished = value;
      }, err => {
        // // handle reseting the swich
        // this.courses.find(c => c.id == course.id).isPublished = !value; // not working
        this.courses.splice(
          this.courses.indexOf(this.courses.find(c => c.id == course.id)), 1, {...course}
        );
      })
    })


    // this.dataService.patchFieldData(this.isAdmin, 'v1/Courses/Update', course.id, [
    //   {
    //     value,
    //     path: '/IsPublished',
    //     op: 'replace'
    //   }
    // ]).subscribe(res => {
    //   // console.log(res); // TODO fix response to return lookups correctly
    //   this.showToastService.showToast('success', 'Updated Successfully', `'${course.name}' Course is now ${value ? 'Published' : 'Unpublished'}`);
    //   // this.getCourses();
    //   this.dataService.getFieldDataById(true, 'v1/Courses', course.id).subscribe(updatedCourse => {
    //     console.log(updatedCourse);
    //     this.courses.splice(
    //       this.courses.indexOf(this.courses.find(c => c.id == course.id)), 1, updatedCourse
    //     );
    //   })

    // }, err => {
    //   // TODO handle reseting the swich if the requests fails
    //   this.courses.splice(
    //     this.courses.indexOf(this.courses.find(c => c.id == course.id)), 1, {...course}
    //   );
    // });
  }

  openCourseDialog(action, item?, e?) {
    if (e) {
      e.stopPropagation();
    }
    let width = '70%';
    if (action == 'delete') width = '55%';
    // const ref = this.dialogService.open(CoursesDialogComponent, {
    //   data: {
    //     item: item,
    //     action
    //   },
    //   width: width,
    //   closable: true,
    //   dismissableMask: true,
    //   closeOnEscape: true,
    //   styleClass: 'dialog-class',
    // });

    // ref.onClose.subscribe((response) => {
    //   if (response) {
    //     if (response.action == 'delete' && this.courses.length == 1 && this.pageNumber != 1) {
    //       this.pageNumber--;
    //     }
    //     this.getCourses();
    //   }
    // });
  }

  toggleCourseMenu(e, courseCard) {
    e.stopPropagation();
    // console.log(courseCard);

    courseCard.classList.toggle('show-menu')
  }

  addToFilters(e, dataName, id) {
    // e.stopPropagation();
    if (id) {
      if (dataName == 'mode') {
        if (!this.selectedLearningModes.includes(id)) {
          this.selectedLearningModes.push(id);
        } else return;
      } else if (dataName == 'skillLevel') {
        if (!this.selectedSkillLevels.includes(id)) {
          this.selectedSkillLevels.push(id);
        } else return;
      } else if (dataName == 'subCategory') {
        if (!this.selectedSubCategories.includes(id)) {
          this.selectedSubCategories.push(id);
        } else return;
      } else if (dataName == 'courseType') {
        if (!this.selectedCourseTypes.includes(id)) {
          this.selectedCourseTypes.push(id);
        } else return;
      }
      // this.filterCourses();
    }
  }

}
