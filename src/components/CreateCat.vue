<template>
  <form @submit.prevent="formUpload">
    <ion-list>
      <ion-item>
        <ion-input v-model="form.name" @change="console.log('form')" label="Name" autofocus
          :placeholder="'Enter' + (subTo ? ' sub-' : ' ') + 'category name'"></ion-input>
      </ion-item>
    </ion-list>
    <ion-button type="submit" @click.prevent expand="block">Submit</ion-button>
  </form>
</template>

<script setup>
import { IonLabel, IonList, IonListHeader, IonInput, IonButton,  IonItem,} from '@ionic/vue'; //for the list 

import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')


const props = defineProps({
  subTo: {
    type: String,
    required: false
  }
})
const emit = defineEmits(['uploaded'])



const form = ref({
  name: null,
})
async function formUpload() {
  // form.value.sub_name = URL_SUBCAT
  form.value.user_id = 1  // CHANGE THIS


  console.log(form.value);

  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    // const userLogin = await JSON.parse(localStorage.getItem('userLogin'));

    await axios.post(API_URL + '/api/exams/' + (props.subTo ? props.subTo : 'cats') , form.value, {
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

</script>
