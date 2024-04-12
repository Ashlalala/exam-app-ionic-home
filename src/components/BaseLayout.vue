<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{title}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <slot />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonContent, IonRefresher, IonRefresherContent, IonPage } from '@ionic/vue';

defineProps({
  title: {
    type: String
  }
})

const emit = defineEmits(['refresh'])


const handleRefresh = event => {
  setTimeout(() => {
    // Any calls to load data go here
    emit('refresh', true)
    event.target.complete();
  }, 2000);
};
</script>

<style scoped>

</style>