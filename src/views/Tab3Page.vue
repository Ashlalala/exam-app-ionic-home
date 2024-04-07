<template>
  <base-layout>

    <button @click="setStorage">Set storage</button><br />
    <button @click="getStorage">Get storage</button>
  </base-layout>
</template>

<script setup>
import {useMainStore} from '@/stores/MainStore'

const main = useMainStore()

function getDAesString(encrypted, key, iv) {//解密
    var key_hash = CryptoJS.MD5(key).toString();
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}





const d = getDAesString('JGuz8V4b2S6sHu9evaE+uKKL6yQgIj+7zfGMycRBFUE=', main.secretKey, main.iv)

console.log(d);



</script>


<style scoped></style>