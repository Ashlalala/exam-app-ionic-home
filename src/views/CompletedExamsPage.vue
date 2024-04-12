<template>
<base-layout>
  <template v-if="response.objects">      
    <div v-for="obj in response.objects">
      <ion-card>
        <ion-card-header>
          <ion-card-title :router-link="'completed/' + obj.examCompleted.id">{{ obj.exam.name }}</ion-card-title>
          <ion-card-subtitle>
            <router-link :to="'/exams/' + obj.exam.category">{{ firstBig(obj.exam.category) }}
            </router-link> >
            <router-link
              :to="'/exams/' + obj.exam.category + '/' + obj.exam.sub_category">{{ firstBig(obj.exam.sub_category) }}
            </router-link>
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-card-subtitle v-for="score in [Math.floor(obj.examCompleted.score*100)]">Score: 
            <ion-badge :color="score > 70 ? 'success' : score > 40 ? 'warning' : 'danger'">{{ score }}%</ion-badge>
          </ion-card-subtitle>
          <p>{{ obj.exam.description }}</p>
          <hr>
          <div class="flex justify-between bg-red-500">
            <!-- <ion-card-subtitle>
              Created by: <router-link :to="'/users/' + response.owner.id">{{ response.owner.name }} </router-link>
            </ion-card-subtitle> -->
            <ion-card-subtitle>Completed: {{ obj.examCompleted.created_at }}</ion-card-subtitle>
          </div>

        <ion-card-header v-if="completed">
          <ion-card-title></ion-card-title>
        </ion-card-header>
        </ion-card-content>
      </ion-card>
    </div>
  </template>
</base-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
import { IonItem, IonLabel, IonList, IonListHeader, IonHeader } from '@ionic/vue'; //for the list 
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonBadge } from '@ionic/vue';

import { onMounted } from 'vue';
import {useMainStore} from '@/stores/MainStore'

const store = useMainStore()

const URL_EXAM_ID = useRoute().params.examId
const API_URL = inject('API_URL')

const response = ref({})

onMounted(async()=>{
  await getCompleted()
})

async function getCompleted(){
  await axios.get(API_URL + '/api/completed').then(res => {
    response.value.objects = res.data
  })
}

function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<style scoped>

</style>