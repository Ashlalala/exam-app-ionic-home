<template>
  <base-layout title="Exams">
    <ion-button @click.prevent="popoverOpen = !popoverOpen" id="click-trigger-2" expand="full">Create Category</ion-button>
    <ion-popover :is-open="popoverOpen" trigger="click-trigger-2" trigger-action="click" size="cover">
      <ion-content class="ion-padding">
        <CreateCat @uploaded="uploaded" />
      </ion-content>
    </ion-popover>
    <ion-list>
      <ion-list-header>
        <ion-label>
          <h1>Choose Category</h1>
        </ion-label>
      </ion-list-header>
      <ion-item-group>
        <ion-item v-for="category in response.categories" :router-link="'/exams/' + category.name">
          <ion-label class="ion-text-nowrap">
            <h2>{{ firstBig(category.name) }}</h2>
          </ion-label>
        </ion-item>
      </ion-item-group>
    </ion-list>
  </base-layout>
</template>

<script setup>
import { IonItem, IonItemGroup } from '@ionic/vue';
import { IonLabel, IonList, IonListHeader, IonInput } from '@ionic/vue'; //for the list 
import { IonButton, IonContent, IonPopover } from '@ionic/vue';//for popover

import { onMounted } from 'vue';
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
import CreateCat from '@/components/CreateCat.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const API_URL = inject('API_URL')


const popoverOpen = ref(false)

const response = ref({})



onMounted(() => {
  getCats()
})
function getCats() {
  // axios.get('http://localhost:8000/sanctum/csrf-cookie')
  axios.get(API_URL + '/api/exams/cats').then(res => {
    console.log(res)
    response.value.categories = res.data
  })
}

function uploaded(){
  popoverOpen.value = false
  getCats()
}

function refresh() {
  getCats()
}



function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>