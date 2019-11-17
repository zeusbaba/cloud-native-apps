<template>

    <v-layout align-space-around justify-center column fill-height>

      <v-flex id="the-logo" xs12>

        <img alt="BAET logo" width="40%" height="40%" src="../assets/logo_main.png">
        <!--
        <v-img src="@/assets/logo_main.png"></v-img>
        -->
      </v-flex>

      <v-flex xs2></v-flex>
      <v-flex id="the-form" xs8>
        <LinkForm />
      </v-flex>
      <v-flex xs2></v-flex>

    </v-layout>

</template>

<script>

  // @ is an alias to /src
  //import LogoMain from '@/assets/logo_main.png';
import LinkForm from '@/components/LinkForm'

export default {
  name: 'link-home',
  components: {
    LinkForm
  }
}
</script>
