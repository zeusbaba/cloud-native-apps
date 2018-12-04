<template>

    <v-layout align-space-around justify-center column fill-height>

      <v-flex id="the-logo">
        <v-spacer></v-spacer>
        <img alt="BAET logo" width="40%" height="40%" src="../assets/logo_main.png">
      </v-flex>

      <v-flex id="the-form">
        <LinkForm />
      </v-flex>

    </v-layout>

</template>

<script>

  // @ is an alias to /src
import LinkForm from '@/components/LinkForm'

export default {
  name: 'link-home',
  components: {
    LinkForm
  }
}
</script>
