<template>
  <base-layout :title="'Create Exam in ' + firstBig(URL_CAT) + ' > ' + firstBig(URL_SUBCAT)">
  <form @submit.prevent="formUpload">
    <ion-list>
      <ion-item>
        <ion-input v-model="form.name" label="Name" placeholder="Enter exam name"></ion-input>
      </ion-item>
      
      <ion-item>
        <ion-input v-model="form.description" label="Description" placeholder="Enter exam descripton"></ion-input>
      </ion-item>
    </ion-list>
    <ion-button type="submit" @click.prevent expand="block">Submit</ion-button>
  </form>
  </base-layout>
</template>

<script setup>
import { IonInput, IonItem, IonList } from '@ionic/vue';
import { IonButton } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')

const router = useRouter()
const route = useRoute()
const URL_CAT = route.params.category
const URL_SUBCAT = route.params.subCategory

const form = ref({
  name: null,
  description: null
})




async function formUpload() {
  form.value.category = URL_CAT
  form.value.sub_category = URL_SUBCAT
  form.value.user_id = 1  // CHANGE THIS

  console.log(form.value);
  
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')
    
    // const userLogin = await JSON.parse(localStorage.getItem('userLogin'));

    await axios.post(API_URL + '/api/exams/' + URL_CAT + '/' + URL_SUBCAT, form.value, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: 'application/json',
        // Authorization: 'Bearer ' + userLogin.token
      }
    }).then(res => {
      console.log(res)
      router.push({ path: `/exam/${res.data.id}`})
    })
  } catch (e) {
    console.log(e);
  }
}

function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>