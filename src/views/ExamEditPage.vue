<template>
  <base-layout title="Edit Exam">
    <ion-popover :is-open="popoverOpen" trigger="click-trigger-9" trigger-action="click" size="cover" side="bottom"
      alignment="center">
      <ion-content class="ion-padding">
        <CreateQuestion @uploaded="uploaded" />
      </ion-content>
    </ion-popover>
    <ion-button @click.prevent="popoverOpen = !popoverOpen" id="click-trigger-9" expand="block" class="footerBtn">Add
      Question</ion-button>

    <ion-card>
      <template v-if="response.exam && response.owner">
        <ion-card-header>
          <ion-card-title :router-link="'/exam/' + URL_EXAM_ID">{{ response.exam.name }}</ion-card-title>
          <ion-card-subtitle>
            <router-link :to="'/exams/' + response.exam.category">
              {{ firstBig(response.exam.category) }}
            </router-link> >
            <router-link :to="'/exams/' + response.exam.category + '/' + response.exam.sub_category">{{
      firstBig(response.exam.sub_category) }}
            </router-link>
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p>{{ response.exam.description }}</p>
          <hr>
          <div class="flex justify-between bg-red-500">
            <ion-card-subtitle>
              Created by: <router-link :to="'/users/' + response.owner.id">{{ response.owner.name }} </router-link>
            </ion-card-subtitle>
            <ion-card-subtitle>{{ response.exam.created_at }}</ion-card-subtitle>
          </div>

        </ion-card-content>
      </template>
    </ion-card>

    <template v-if="editingQA.type">
        <EditQuestion :qa="editingQA" @uploaded="uploaded" />
    </template>
    <template v-else-if="response.all">
      <QuestionList :all="response.all" :edit="true" @editing="editing" @remove="remove"/>
    </template>
  </base-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { inject } from 'vue';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import { IonButton, IonContent, IonPopover } from '@ionic/vue';//for popover
import { useMainStore } from '@/stores/MainStore'



import CreateQuestion from '@/components/CreateQuestion.vue'
import QuestionList from '@/components/QuestionList.vue'
import EditQuestion from '@/components/EditQuestion.vue'


const store = useMainStore()

const popoverOpen = ref(false)

const editingQA = ref({
  form: {}
})

const routeParams = useRoute().params
const API_URL = inject('API_URL')
const URL_EXAM_ID = routeParams.examId

const response = ref({
  qas: [],
  groups: [],
  all: null,
})

function editing(info) {
  editingQA.value = {
  form: {}
  }
  let searchIn = info.type == 'qa' ? response.value.qas : response.value.groups 
  let match = null
  searchIn.forEach(qa=>{
    if(qa.id == info.id) match = qa
  })
  if(match) {
    if(info.type == 'qa'){  
      editingQA.value.id = match.id
      editingQA.value.form.question = match.question

      match.answers.forEach((ans, i)=>{
        if(i==0){ 
         if(ans.right)editingQA.value.form.ans_r = ans.val
        }else{
          editingQA.value.form['ans_'+(i)] = ans.val
        }
      })
      editingQA.value.type = 'qa'
    } else if(info.type == 'group'){  
      editingQA.value.id = match.id
      editingQA.value.form.ans_fake = match.ans_fake

      match.qas.forEach((qa, i)=>{
        editingQA.value.form['question_'+(i+1)] = qa.question
        editingQA.value.form['ans_'+(i+1)] = qa.ans_r
      })

      editingQA.value.type = 'group'
    }
  }
}

async function remove(info){
  const type = info.type=='qa' ? 'qa' : 'group'
  await axios.delete(API_URL + '/api/exam/' + URL_EXAM_ID + '/' + type + '/' + info.id).then(res=>{
    console.log(res);
  })
  uploaded()
}

async function uploaded() {
  popoverOpen.value = false
  editingQA.value = {
  form: {}
  }
  await getQAs()
  await getGroups()
  sortGroupsAndQAs(response.value.groups, response.value.qas)
}


onMounted(async () => {
  await getExamAndOwner()
  await getQAs()
  await getGroups()
  sortGroupsAndQAs(response.value.groups, response.value.qas)
})



async function getQAs() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/qa').then(res => {
    response.value.qas = []
    handleQAs(res.data.data)
  })
}
async function getGroups() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/group').then(res => {
    response.value.groups = []
    console.log(res.data);
    res.data.data.forEach(g => {
      let newGroup = getCleanAndDecryptedGroups(g, store.secretKey, store.iv) // The right answer should always be first in the arr
      response.value.groups.push(newGroup)
    })
  })
}

function sortGroupsAndQAs(groups, qas) {
  let joinedArr = [...groups, ...qas]
  joinedArr.sort((a, b) => compareDates(a.created_at, b.created_at))
  response.value.all = joinedArr
}



function handleQAs(r) {
  r.forEach(qa => {
    let qaNew = {
      id: qa.id,
      question: qa.question,
      created_at: qa.created_at,
      answers: getCleanAndDecrypted([qa.ans_r, qa.ans_1, qa.ans_2, qa.ans_3, qa.ans_4, qa.ans_5], store.secretKey, store.iv) // The right answer should always be first in the arr
    }
    response.value.qas.push(qaNew)
  })
}

function getCleanAndDecrypted(arr, key, iv) {
  const ansArr = []
  arr.forEach((value, index) => {
    let valueDecrypted = getDAesString(value, key, iv)
    if (valueDecrypted) {
      let ansObj = {
        val: valueDecrypted,
        right: index == 0
      }
      ansArr.push(ansObj)
    }
  })
  return ansArr
}
function getCleanAndDecryptedGroups(group, key, iv) {
  let groupNew = {
    id: group.id,
    exam_id: group.exam_id,
    created_at: group.created_at,
    qas: [],
    ans_fake: group.ans_fake//getDAesString(group.ans_fake, key, iv)
  }
  group.qas.forEach((qa) => {
    let qaNew = {
      question: qa.question, //getDAesString(qa.question, key, iv),
      ans_r: getDAesString(qa.ans_r, key, iv)
    }
    groupNew.qas.push(qaNew)
  })
  return groupNew
}

async function getExamAndOwner() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID).then(async (res) => {
    response.value.exam = res.data.data
    await getExamOwner()
  })
}


async function getExamOwner() {
  await axios.get(API_URL + '/api/user/' + response.value.exam.user_id).then(res => {
    response.value.owner = res.data
  })
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

function compareDates(a, b) {
  if (dateAndTimeToInt(a).date > dateAndTimeToInt(b).date) return -1
  if (dateAndTimeToInt(a).time > dateAndTimeToInt(b).time) return -1
  return +1
}

function dateAndTimeToInt(a) {
  return {
    date: parseInt(a.slice(0, 4) + a.slice(5, 7) + a.slice(8, 10)),
    time: parseInt(a.slice(11, 13) + a.slice(14, 16) + a.slice(17, 19))
  }
}
</script>

<style></style>
