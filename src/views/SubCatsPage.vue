<template>
  <base-layout title="Exams">
  <ion-button @click.prevent="popoverOpen = !popoverOpen" id="click-trigger" expand="full">Create Sub-category in {{ firstBig(URL_CAT) }}</ion-button>
    <ion-popover :is-open="popoverOpen" trigger="click-trigger" trigger-action="click" size="cover">
      <ion-content class="ion-padding">
        <CreateCat @uploaded="uploaded" :subTo="URL_CAT" />
      </ion-content>
    </ion-popover>
    
    <ion-list>
      <ion-list-header>
        <ion-label><h1>Choose from {{ firstBig(URL_CAT) }}</h1></ion-label>
      </ion-list-header>
          <ion-item v-for="category in response.categories" :router-link="'/exams/' + URL_CAT + '/' + category.name" >
            <ion-label class="ion-text-nowrap">
              <h2>{{ firstBig(category.name) }}</h2>
            </ion-label>
          </ion-item>
    </ion-list>
  </base-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
import { IonItem, IonLabel, IonList, IonListHeader } from '@ionic/vue'; //for the list 
import { IonButton, IonContent, IonPopover } from '@ionic/vue';//for popover
import CreateCat from '@/components/CreateCat.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter()

const URL_CAT = useRoute().params.category
const API_URL = inject('API_URL')
const response = ref({})

const popoverOpen = ref(false)

onMounted(() => {
  getCats()
})
function getCats(){
// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL + '/api/exams/' + URL_CAT).then(res => {
  response.value.categories = res.data
})
}

function uploaded(){
  popoverOpen.value = false
  getCats()
}



function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


</script>