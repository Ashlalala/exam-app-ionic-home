<template>
  <ion-list>
    <ion-list-header>
      <ion-label><h1>{{firstBig(cat)}} > {{firstBig(subCat)}}</h1></ion-label>
    </ion-list-header>
    <!-- //change to ion-card  -->
    <ion-item v-for="exam in exams" :router-link="'/exam/' + exam.id"> 
      <ion-label class="ion-text-nowrap">
        <h2>{{ exam.name }}</h2>
        <p>{{ exam.description }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup>
import { IonItem, IonLabel, IonList, IonListHeader } from '@ionic/vue'; //for the list 
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')


defineProps({
  exams: {
    type: Array,
    required: true
  },
  cat: {
    type: String,
    required: true
  },
  subCat: {
    type: String,
    required: true
  }
})


function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

</script>