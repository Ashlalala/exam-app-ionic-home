<template>
  <div>
    <ion-segment value="default">
      <ion-segment-button @click="form.type = 'full'" value="default">
        <ion-label>Alternatives</ion-label>
      </ion-segment-button>
      <ion-segment-button @click="form.type = 'part'" value="segment">
        <ion-label>Matching</ion-label>
      </ion-segment-button>
    </ion-segment>

    <form v-if="form.type == 'full'" @submit.prevent="uploadAltQA">
      <ion-list>
        <ion-item>
          <ion-input v-model="form.question" label="Question *" autofocus placeholder="Enter the question"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="form.ans_r" label="Right answer *" placeholder="Enter the right answer"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="form.ans_1" label="Wrong answer 1 *" placeholder="Enter wrong answer 1"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="form.ans_2" label="Wrong answer 2" placeholder="Enter wrong answer 2"></ion-input>
        </ion-item>
        <ion-item v-if="form.ans_2">
          <ion-input v-model="form.ans_3" label="Wrong answer 3" placeholder="Enter wrong answer 3"></ion-input>
        </ion-item>
        <ion-item v-if="form.ans_3">
          <ion-input v-model="form.ans_4" label="Wrong answer 4" placeholder="Enter wrong answer 4"></ion-input>
        </ion-item>
        <ion-item v-if="form.ans_4">
          <ion-input v-model="form.ans_5" label="Wrong answer 5" placeholder="Enter wrong answer 5"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button type="submit" @click.prevent expand="block">Submit</ion-button>
    </form>
    <form v-if="form.type == 'part'" @submit.prevent="uploadMatchQA">
      <ion-list>
        <ion-item>
          <ion-list>
            <ion-input v-model="form.question_1" label="Question 1*" autofocus placeholder="Enter the question"></ion-input>
            <ion-input v-model="form.ans_1" label="Answer 1*" placeholder="Enter the right answer"></ion-input>
          </ion-list>
        </ion-item>
        <ion-item>
          <ion-list>
            <ion-input v-model="form.question_2" label="Question 2*" autofocus placeholder="Enter the question"></ion-input>
            <ion-input v-model="form.ans_2" label="Answer 2*" placeholder="Enter the right answer"></ion-input>
          </ion-list>
        </ion-item>
        <ion-item>
          <ion-list>
            <ion-input v-model="form.question_3" label="Question 3" autofocus placeholder="Enter the question"></ion-input>
            <ion-input v-model="form.ans_3" label="Answer 3" placeholder="Enter the right answer"></ion-input>
          </ion-list>
        </ion-item>
        <ion-item v-if="form.question_3">
          <ion-list>
            <ion-input v-model="form.question_4" label="Question 4" autofocus placeholder="Enter the question"></ion-input>
            <ion-input v-model="form.ans_4" label="Answer 4" placeholder="Enter the right answer"></ion-input>
          </ion-list>
        </ion-item>
      </ion-list>
      <ion-item>
        <ion-input v-model="form.ans_fake" label="Fake answer*" placeholder="Enter the fake answer"></ion-input>
      </ion-item>
      <ion-button type="submit" @click.prevent expand="block">Submit</ion-button>
    </form>
  </div>

</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue';
import { IonButton, IonList, IonListHeader, IonInput, IonItem, } from '@ionic/vue'; //for the list 

const routeParams = useRoute().params
const API_URL = inject('API_URL')
const URL_EXAM_ID = routeParams.examId

const emit = defineEmits(['updated'])

const form = ref({
  type: 'full',
  question: null,
  ans_r: null,
  ans_1: null,
  ans_2: null,
  ans_3: null,
  ans_4: null,
  ans_5: null,
})


async function uploadAltQA() {
  // form.value.sub_name = URL_SUBCAT
  // form.value.user_id = 1  // CHANGE THIS
  form.value.exam_id = URL_EXAM_ID
  form.value.type = 'full'
  console.log(form.value);
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    // const userLogin = await JSON.parse(localStorage.getItem('userLogin'));

    await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/qa', form.value, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
    }).then(res => {
      console.log(res)
      emit('uploaded', true)
    })
  } catch (e) {
    console.log(e);
  }
}
async function uploadMatchQA() {
  form.value.type = 'part'
  let formMatchQA = {
    exam_id: URL_EXAM_ID,
    qa_1: await uploadPartQA(form.value.question_1, form.value.ans_1),
    qa_2: await uploadPartQA(form.value.question_2, form.value.ans_2),
    ans_fake: form.value.ans_fake
  }
  if(form.value.question_3 && form.value.ans_3){
    formMatchQA.qa_3 = await uploadPartQA(form.value.question_3, form.value.ans_3)
  }
  if(form.value.question_4 && form.value.ans_4){
    formMatchQA.qa_4 = await uploadPartQA(form.value.question_4, form.value.ans_4)
  }

  console.log(formMatchQA);
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    // const userLogin = await JSON.parse(localStorage.getItem('userLogin'));

    await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/group', formMatchQA, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
    }).then(res => {
      console.log(res)
    })
  } catch (e) {
    console.log(e);
  }
}

async function uploadPartQA(q, a){
  const qaPartForm = {
    type: 'part',
    question: q,
    ans_r: a,
    exam_id: URL_EXAM_ID,
  }
  let output = null  
  try {
    // const userLogin = await JSON.parse(localStorage.getItem('userLogin'));
    await axios.post(API_URL + '/api/exam/' + URL_EXAM_ID + '/qa/', qaPartForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
    }).then(res => {
      console.log(res)
      output = res.data.id
    })
  } catch (e) {
    console.log(e);
  }
  return output //change this to return at then(()=>{}) 
}
</script>
