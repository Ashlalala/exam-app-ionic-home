<template>
  <base-layout :title="response.exam ? response.exam.name : ''">
  <template v-if="response.qas.length" v-for="qa in [response.qas[store.examPage]]">
      <ion-card v-if="qa.question">
        <ion-card-header>
          <ion-card-title>{{ qa.question }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-radio-group value="space-between" v-model="form.ans">
            <ion-item v-if="qa.answers" v-for="ans in qa.answers">
              <ion-radio :value="ans" :name="qa.id" justify="space-between">{{ans}}</ion-radio>
            </ion-item>
        </ion-radio-group>
      </ion-card-content>
      </ion-card>
    </template>
    <div class="footerBtn">
      <ion-button v-if="store.examPage < response.qas.length-1" expand="full" @click.prevent="submitAns">Submit Answer</ion-button>
      <ion-button v-else expand="full" @click.prevent="submitExam">Submit Exam</ion-button>

      <ion-button expand="full" fill="outline" @click.prevent="cancelExam">Cancel Exam</ion-button>
    </div>
  </base-layout>
</template>

<script setup>
import QuestionList from '@/components/QuestionList.vue'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonRadio, IonRadioGroup, IonItem } from '@ionic/vue';

import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import {useMainStore} from '@/stores/MainStore'

const store = useMainStore()

const router = useRouter()

const routeParams = useRoute().params
const API_URL = inject('API_URL')
const URL_EXAM_ID = routeParams.examId

const response = ref({
  qas: []
})

const form = ref({})

const page = ref(1)

async function submitAns({last}){
  form.value.qa_id = response.value.qas[store.examPage].id
  console.log('form', form.value)
  await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/started/' + response.value.started.id, form.value, {
    headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
  }).then(res => {
    console.log(res.data);
    
  })
  
  if(!last) store.nextPage()
}
async function submitExam(){
  let id
  await submitAns({last:true})
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

function change(e){
  console.log('e.target');
  console.log(e.target);
}




onMounted(async () => {
  await getExamAndOwner()
  await startExam()
  await getQAs()
})




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
      id: null,
      question: null,
      answers: []
    }
    qaNew.id = qa.id
    qaNew.question = qa.question
    const responseAnswers = getCleanAndDecrypted([qa.ans_r, qa.ans_1, qa.ans_2, qa.ans_3, qa.ans_4, qa.ans_5], store.secretKey, store.iv)
    qaNew.answers = mixUp(responseAnswers)
    response.value.qas.push(qaNew)
  })
}






function mixUp(arr){
  let lettersArr = ['a', 'b', 'c', 'd', 'e']
  let l = arr.length
  
  let output = {}

  for(let i = 0; i<l; i++){
    let letter = lettersArr[i]
    let randIndexInArr = Math.floor(Math.random()*arr.length)
    
    output[letter] = arr[randIndexInArr]
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