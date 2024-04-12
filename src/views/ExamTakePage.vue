<template>
  <base-layout :title="response.exam ? response.exam.name : ''">
  <template v-if="response.all.length" v-for="one in [response.all[store.examPage]]">
    <br>
    <template v-if="one.question">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ one.question }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-radio-group value="space-between" v-model="form.ans">
            <ion-item v-if="one.answers" v-for="ans in one.answers">
              <ion-radio :value="ans" :name="one.id" justify="space-between">{{ans}}</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-card-content>
      </ion-card>
    </template>

    <template v-if="one.qas">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Match the question number to the right answer</ion-card-title>        
        </ion-card-header>
        <ion-card-content>
          <template v-for="(qa, i) in one.qas">
            <h1>
              <b>{{alphabet[i]}})</b> {{ qa.question }}
            </h1>
          </template>
          <ion-item>
            <ion-list>
              <ion-item v-for="(ans, i) in matchAnswers" :key="qa">
                <ion-label></ion-label>
                <ion-label>{{ ans }}</ion-label>
                <ion-button :id="'open-action-sheet-'+i" slot="end">Open</ion-button>
                <ion-action-sheet :value="ans" :trigger="'open-action-sheet-'+i" header="Actions" :buttons="actionSheetButtons" @didDismiss="logResult($event)"></ion-action-sheet>
              </ion-item>
            </ion-list> 
          </ion-item>
        </ion-card-content>

      </ion-card>
    </template>



    <div class="footerBtn">
      <div v-if="store.examPage < response.all.length-1">
        <ion-button v-if="one.question" expand="full" @click.prevent="submitAns">Submit Answer</ion-button>
        <ion-button v-if="one.qas" expand="full" @click.prevent="submitAnsGroup">Submit Answer.</ion-button>
      </div>
      <ion-button v-else expand="full" @click.prevent="submitExam">Submit Exam</ion-button>
      
      <ion-button expand="full" fill="outline" @click.prevent="cancelExam">Cancel Exam</ion-button>
    </div>
  </template>  
  </base-layout>
</template>

<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonRadio, IonRadioGroup, IonItem } from '@ionic/vue';
import { IonLabel, IonList, IonInput, IonActionSheet } from '@ionic/vue';

import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import { ref, computed } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import {useMainStore} from '@/stores/MainStore'

const store = useMainStore()

const router = useRouter()

const routeParams = useRoute().params
const API_URL = inject('API_URL')
const URL_EXAM_ID = routeParams.examId

const page = ref(1)

const response = ref({
  qas: [],
  all: []
})

const alphabet = ['a','b','c','d','e','f','j','h']

const actionSheetButtons = ref([])

const form = ref({})






const matchAnswers = ref([])


async function submitAns({last, customForm}){
  let uploadForm = {}
  if(customForm){
    uploadForm = customForm
  }else{
    uploadForm = form.value
    uploadForm.qa_id = response.value.all[store.examPage].id
  }
  console.log(uploadForm)
  await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id, uploadForm, {
    headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
  }).then(res => {
    console.log(res.data);

  })
  form.value = {}
  if(!last && !customForm) nextPage()
}

function nextPage(){
  store.nextPage()
  updateMatchAnswers()
}

async function submitAnsGroup({last}){
  let groupForm = {
    group_id: response.value.all[store.examPage].id
  }
  console.log(response.value.all[store.examPage])
  console.log(response.value.started.id);
  console.log('form', groupForm)
  await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id + '/group', groupForm, {
    headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
  }).then(async res => {
    console.log(res.data);
    response.value.all[store.examPage].qas.forEach(async (qa, i)=>{
      await submitAns({customForm:{
        answered_group_id: res.data.id, 
        qa_id: qa.id,
        ans: moveable.value[i],
        type: 'part'
      }})
    })
    console.log(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id + '/group/' + res.data.id + '/answered')
    await axios.patch(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id + '/group/' + res.data.id + '/answered').then(res=>{
      console.log(res)
    })
  })
  form.value = {}
  if(!last) store.nextPage()
  updateMatchAnswers()
}
async function submitExam(){
  let id = 0
  response.value.all[store.examPage].qas ? await submitAnsGroup({last:true}) : await submitAns({last:true})
  await axios.patch(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id + '/completed').then(res => {
    console.log(res.data);
    id = res.data.id
  })
  store.clearPage()
  router.push({ path: `/profile/completed/${id}`})

}
function cancelExam(){
  console.log('form.value.ans');
}





const handleReorder = (event) => {
  // Before complete is called with the items they will remain in the
  // order before the drag
  console.log('Before complete', moveable.value);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. Update the items variable to the
  // new order of items
  moveable.value = event.detail.complete(moveable.value);

  // After complete is called the items will be in the new order
  console.log('After complete', moveable.value);
};


onMounted(async () => {
  await getExamAndOwner()
  await startExam()
  await getQAs()
  await getGroups()
  sortGroupsAndQAs(response.value.groups, response.value.qas)




  
  response.value.all.forEach(one => {
    if(one.qas){
      one.qas.forEach((qa, i) => {
        actionSheetButtons.value.push(
          {
            text: alphabet[i],
            role: 'setter',
            data: {
              action: 'setLetter',
              letter: alphabet[i],
              qaId: qa.id,
            },
          }
        )
      })
    }
  })
  actionSheetButtons.value.push(
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  )

  console.log('resss',response.value.all);
  console.log('sasaas',actionSheetButtons)
})

function logResult(ev){
  console.log(JSON.stringify(ev.detail, null, 2));
  console.log(ev.target.attributes.value);
  console.log(ev.detail);
  console.log(ev);

};






















async function getGroups() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/group').then(res => {
    response.value.groups = []
    console.log(res);
    res.data.data.forEach(g => {
      let newGroup = getCleanAndDecryptedGroups(g, store.secretKey, store.iv) // The right answer should always be first in the arr
      response.value.groups.push(newGroup)
    })
  })
}

function sortGroupsAndQAs(groups, qas){
  groups.forEach(g=>{
    let answersArr = []
    g.qas.forEach(qa=>{
      answersArr.push(qa.ans_r)
    })
    answersArr.push(g.ans_fake)
    g.answers = mixUp(answersArr)
  })
  let joinedArr = [...groups, ...qas]
  joinedArr.sort((a, b) => compareDates(a.created_at, b.created_at))
  response.value.all = joinedArr
  console.log(response.value.all[store.examPage])
  updateMatchAnswers()
  console.log(matchAnswers)
}

function updateMatchAnswers(){
  // if(response.value.all[store.examPage].qas){
  //   moveable.value = []
  //   response.value.all[store.examPage].qas.forEach(qa=>{
  //     let addToMoveable = {
  //       qa_id: qa.id
  //     }
  //     moveable.value.push(qa.id)
  //     // moveable.value.push(addToMoveable)
  //   })
  //   moveable.value.push('fake')
  if(response.value.all[store.examPage].qas){
    matchAnswers.value = []
    response.value.all[store.examPage].answers.forEach(ans=>{

      matchAnswers.value.push(ans)
      // moveable.value.push(addToMoveable)
    })
    console.log(matchAnswers);
    // moveable.value.push('fake')
  }
}

async function getExamAndOwner(){
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID).then(async res => {
    response.value.exam = res.data.data
    await getExamOwner()
  })
}


async function getExamOwner(){
  await axios.get(API_URL + '/api/user/' + response.value.exam.user_id).then(res => {
    response.value.owner = res.data
  })
}

async function startExam(){
  await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/started').then(res => {
    response.value.started = res.data
  })
}



async function getQAs() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/qa').then(res => {
    const r = res.data.data
    handleQAs(r)
  })
}

function handleQAs(r){
  r.forEach(qa => {
    let qaNew = {
      id: qa.id,
      question: qa.question,
      created_at: qa.created_at,
      answers: mixUp(getCleanAndDecrypted([qa.ans_r, qa.ans_1, qa.ans_2, qa.ans_3, qa.ans_4, qa.ans_5], store.secretKey, store.iv)) // The right answer should always be first in the arr
    }
    response.value.qas.push(qaNew)
  })
}






function mixUp(arr){
  let l = arr.length
  
  let output = []

  for(let i = 0; i<l; i++){
    let randIndexInArr = Math.floor(Math.random()*arr.length)
    
    output.push(arr[randIndexInArr])
    arr.splice(randIndexInArr, 1)
  }

  return output
}

function getCleanAndDecrypted(arr, key, iv){
  const ansArr = []
  arr.forEach(value => {
    let valueD = getDAesString(value, key, iv)
    if(valueD) {
      ansArr.push(valueD)
    }
  })
  return ansArr
}

function getCleanAndDecryptedGroups(group, key, iv){
  let groupNew = {
    id: group.id,
    exam_id: group.exam_id,
    created_at: group.created_at,
    qas: [],
    ans_fake: group.ans_fake //getDAesString(group.ans_fake, key, iv)
  }
  group.qas.forEach((qa) => {
    let qaNew = {
      id: qa.id,
      question: qa.question, //getDAesString(qa.question, key, iv),
      ans_r: getDAesString(qa.ans_r, key, iv)
    }
    groupNew.qas.push(qaNew) 
  })
  return groupNew
}

function getDAesString(encrypted, key, iv) {//解密
    var key_hash = CryptoJS.MD5(key).toString();
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function compareDates(a, b){
  if(dateAndTimeToInt(a).date > dateAndTimeToInt(b).date) return -1
  if(dateAndTimeToInt(a).time > dateAndTimeToInt(b).time) return -1
  return +1
}

function dateAndTimeToInt(a){
  return {
    date: parseInt(a.slice(0,4)+a.slice(5,7)+a.slice(8,10)),
    time: parseInt(a.slice(11,13)+a.slice(14,16)+a.slice(17,19))
  }
}
</script>

<style>
.footerBtn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: white
}
</style>