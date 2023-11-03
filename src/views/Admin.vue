<template>
  <div class="admin">
    <h1>Admin</h1>
    <NotificationAfterRedirection :route="route" :window="getWindow()"/>
    <Notification v-if="showNotification" :message="notificationMessage" :type="notificationType"/>
    <section class="users">
      <User v-for="user in users" :key="user.uid" :user="user" />
    </section>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

import Notification from '@/components/utils/Notification.vue'

import { firestoreService } from '@/firebase/config'
import User from '@/components/User.vue'
import { useRoute } from 'vue-router'
import NotificationAfterRedirection from '@/components/utils/NotificationAfterRedirection.vue'

export default {
  components: { Notification, User, NotificationAfterRedirection },
  setup() {
    const users = ref([])
    const route = useRoute()

    const getWindow = () => {
      return window;
    }

    onMounted(async () => {
      const userSnapshot = await firestoreService.collection('users').get()
      userSnapshot.forEach(doc => users.value.push({ ...doc.data(), uid: doc.id }))
    })

    return {
      users,
      route, getWindow
    }
  }
}
</script>

<style scoped>
.admin {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}

section {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: solid;
  margin-top: 25px;
}

button {
  margin-bottom: 20px;
}

.users {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}
</style>