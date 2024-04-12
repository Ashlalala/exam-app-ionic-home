<template>
  <ion-list>
    <ion-card v-for="one in all">
      <template v-if="one.question">
        <ion-card-header>
          <ion-card-title>{{ one.question }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-radio-group value="space-between" v-if="one.answers">
            <ion-item v-for="ans in one.answers"
              :color="ans.right && ans.selected ? 'light' : ans.right && !ans.selected ? 'success' : ans.right ? 'success' : ans.selected ? 'light' : ''">
              {{ ans.val }}
              <ion-icon v-if="ans.selected && ans.right" slot="end" :icon="checkmarkCircleOutline" size="large"
                color="success"></ion-icon>
              <ion-icon v-else-if="ans.selected && !ans.right" slot="end" :icon="closeCircleOutline" size="large"
                color="danger"></ion-icon>
            </ion-item>
          </ion-radio-group>
        </ion-card-content>
      </template>
      <template v-else-if="one.qas">
        <template v-if="!edit" v-for="(qa, i) in one.qas">
          <ion-card-content>
            <ion-accordion-group>
              <ion-accordion :value="i" :multiple="true" toggle-icon-slot="start">
                <ion-item slot="header">
                  <ion-card-title>
                    {{ qa.question }}
                  </ion-card-title>
                  <ion-icon v-if="qa.correct" slot="end" :icon="checkmarkCircleOutline" size="large" color="success"
                    </ion-icon>
                    <ion-icon v-else slot="end" :icon="closeCircleOutline" size="large" color="danger" </ion-icon>
                </ion-item>
                <div slot="content">
                  <ion-item color="light">
                    <p>Your answer: {{ qa.ans }}</p>
                  </ion-item>
                  <ion-item>
                    <p>Correct answer: {{ qa.ans_r }}</p>
                  </ion-item>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card-content>
        </template>

        <template v-else>
          <template v-for="(qa, i) in one.qas">
            <ion-card-content>
              <ion-card-header>
                <ion-card-title>
                  {{ qa.question }}
                </ion-card-title>
              </ion-card-header>
              <ion-item>
                {{ qa.ans_r }}
              </ion-item>
            </ion-card-content>
          </template>
          <ion-card-content>
            <ion-card-header>
              <ion-card-title>
                Fake Answer:
              </ion-card-title>
            </ion-card-header>
            <ion-item>
              {{ one.ans_fake }}
            </ion-item>
          </ion-card-content>
        </template>
      </template>
      <ion-button v-if="edit" expand="block" @click="emit('editing', {id: one.id, type: one.question? 'qa' : 'group'})">Edit</ion-button>
      <ion-button v-if="edit" expand="block" @click="emit('remove', {id: one.id, type: one.question? 'qa' : 'group'})" color="danger">Delete</ion-button>
    </ion-card>
  </ion-list>

</template>

<script setup>
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/vue';
import { IonItem, IonList, IonRadio, IonRadioGroup, IonAccordion, IonAccordionGroup } from '@ionic/vue';
import { IonIcon } from '@ionic/vue';
import { closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { IonLabel, IonReorder, IonReorderGroup } from '@ionic/vue';

import { ref, onMounted, computed, onBeforeUpdate } from 'vue'

const emit = defineEmits(['editing'])

const props = defineProps({
  all: {
    type: Array,
    required: true
  },
  edit: {
    type: Boolean,
    required: false
  }
})


console.log(props.all)

const alphabet = ref(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])

onMounted(async () => {
  // setTimeout(() => {
  console.log(props.all);
  // }, 3000)
})

const handleReorder = (event) => {
  // Before complete is called with the items they will remain in the
  // order before the drag
  console.log('Before complete', alphabet.value);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. Update the items variable to the
  // new order of items
  alphabet.value = event.detail.complete(alphabet.value);

  // After complete is called the items will be in the new order
  console.log('After complete', alphabet.value);
};
</script>

<style>
.correct {
  background-color: chartreuse;
  width: full;
  height: full;
}

.selected {
  background-color: red;
  border: solid black 2;
  width: full;
  height: full;
}

.rightAns {
  background-color: chartreuse;
  width: full;
  height: full;
}
</style>