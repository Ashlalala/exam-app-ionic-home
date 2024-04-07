<template>
<base-layout>
  <template v-if="response.completedExam && response.exam && response.owner">
    <ExamCard :response="response" :completed="true"/>

    <template v-if="response.qas">
      lllllllllll
      <QuestionList :qas="response.qas" />
    </template>
  </template>
</base-layout>
</template>

<script setup>

import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
import { IonItem, IonLabel, IonList, IonListHeader, IonHeader } from '@ionic/vue'; //for the list 
import ExamCard from '@/components/ExamCard.vue';
import QuestionList from '@/components/QuestionList.vue';

import { onMounted } from 'vue';
import {useMainStore} from '@/stores/MainStore'

const store = useMainStore()

const URL_EXAM_ID = useRoute().params.examId
const API_URL = inject('API_URL')

const response = ref({})

onMounted(async () => {
  await getCompleted()
  await getExamAndOwner()
  await getAnsweredQAs()
  await getQAs()
})

async function getAnsweredQAs() {
  await axios.get(API_URL + '/api/completed/' + URL_EXAM_ID + '/qa').then(res => {
    response.value.answeredQas=res.data
  })
}

async function getQAs() {

  response.value.qas = []

  response.value.answeredQas.forEach(async (answeredQa) => {
    await axios.get(API_URL + '/api/completed/qa/' + answeredQa.qa_id).then(res => {
      let qa = res.data.data
      let qaNew = {
        id: qa.id,
        question: qa.question,
        answers: []
      }
      const responseAnswers = getCleanedAndLabeledAndDecrypted([qa.ans_r, qa.ans_1, qa.ans_2, qa.ans_3, qa.ans_4, qa.ans_5], qa.id, store.secretKey, store.iv) //The right answer should always be the first in the input array
      console.log(responseAnswers)
      qaNew.answers = mixUp(responseAnswers)
      console.log(qaNew.answers)
      response.value.qas.push(qaNew)
    })
  });
}

async function getCompleted(){
  await axios.get(API_URL + '/api/completed/' + URL_EXAM_ID).then(async res => {
    response.value.completedExam = res.data
    await getExamOwner()
  })
}

async function getExamAndOwner(){
  await axios.get(API_URL + '/api/exam/' + response.value.completedExam.exam_id).then(async res => {
    response.value.exam = res.data.data
    await getExamOwner()
  })
}


async function getExamOwner(){
  await axios.get(API_URL + '/api/user/' + response.value.completedExam.user_id).then(res => {
    response.value.owner = res.data
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

function getCleanedAndLabeledAndDecrypted(arr, qaId, key, iv){
  const ansArr = []
  arr.forEach((value, i) => {
    let valueD = getDAesString(value, key, iv)
    if(valueD) {
      let ans = {
        val: valueD,
        isRightAns: i == 0 ,
        selected: false
      }
      response.value.answeredQas.forEach(qa=>{
        console.log(valueD, qa.ans)
        if(valueD == qa.ans && qaId == qa.qa_id) ans.selected = true
      })
      ansArr.push(ans)
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

<style scoped>

</style>