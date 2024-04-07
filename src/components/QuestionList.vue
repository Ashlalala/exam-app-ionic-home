<template>
  {{ all }}

  <ion-list>
    <ion-card v-for="one in all">
      <template v-if="one.question">
        <ion-card-header>
          <ion-card-title>{{ one.question }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-radio-group value="space-between" v-if="one.answers">
            <ion-item v-if="one.ans_r">
              <div class="rightAns">
                <ion-radio :value="one.ans_r" :name="one.id" justify="space-between" onChange="change()">{{one.ans_r}}</ion-radio>
              </div>
            </ion-item>
            <ion-item v-for="ans in one.answers">
              {{ ans }}
              <ion-radio :value="ans.val" :name="one.id" justify="space-between" onChange="change()">{{ans.val}}  {{ ans.right ? '(Right Answer)' : '' }}</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-card-content>
      </template>
      <template v-else-if="one.qas">
        <template v-for="qa in one.qas">            
          <ion-card-header>
            <ion-card-title>{{ qa.question }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-radio-group value="space-between" v-if="qa.answers">
              <ion-item v-if="qa.ans_r">
                <div class="rightAns">
                  <ion-radio :value="qa.ans_r" :name="qa.id" justify="space-between" onChange="change()">{{qa.ans_r}}</ion-radio>
                </div>
              </ion-item>
              <ion-item v-for="ans in qa.answers">
                {{ ans }}
                <ion-radio :value="ans.val" :name="qa.id" justify="space-between" onChange="change()">{{ans.val}}  {{ ans.right ? '(Right Answer)' : '' }}</ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-card-content>
        </template>
      </template>
    </ion-card>
  </ion-list>

</template>

<script setup>
import { IonItem, IonList, IonRadio, IonRadioGroup } from '@ionic/vue';

const props = defineProps({
  all: {
    type: Array,
    required: true
  }
})

</script>

<style>
.correct{
  background-color: chartreuse;
  width: full;
  height: full;
}
.selected{
  background-color: red;
  border: solid black 2;
  width: full;
  height: full;
}
.rightAns{
  background-color: chartreuse;
  width: full;
  height: full;
}
</style>