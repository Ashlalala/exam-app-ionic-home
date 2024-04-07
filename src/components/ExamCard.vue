<template>
  <ion-card>

    <ion-card-header>
      <ion-card-title>{{ response.exam.name }}</ion-card-title>
      <ion-card-subtitle>
        <router-link :to="'/exams/' + response.exam.category">{{ firstBig(response.exam.category) }}
        </router-link> >
        <router-link
          :to="'/exams/' + response.exam.category + '/' + response.exam.sub_category">{{ firstBig(response.exam.sub_category) }}
        </router-link>
      </ion-card-subtitle>
    </ion-card-header>
    
    <ion-card-content>
      <ion-card-subtitle v-if="response.exam.qAmount">
        <h4><b>{{response.exam.qAmount}}</b> questions</h4>
      </ion-card-subtitle>
      <p>{{ response.exam.description }}</p>
      <hr>
      <div class="flex justify-between bg-red-500">
        <ion-card-subtitle>
          Created by: <router-link :to="'/users/' + response.owner.id">{{ response.owner.name }} </router-link>
        </ion-card-subtitle>
        <ion-card-subtitle>{{ response.exam.created_at }}</ion-card-subtitle>
      </div>

    <ion-card-header v-if="completed">
      <ion-card-title>Score: {{ response.completedExam.score*100 }}%</ion-card-title>
    </ion-card-header>
    </ion-card-content>
  </ion-card>

</template>

<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/vue';

const props = defineProps({
  response: {
    type: Object,
    required: true
  },
  completed: {
    type: Boolean,
    required: false
  } 
})






function firstBig(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

</script>

<style scoped></style>