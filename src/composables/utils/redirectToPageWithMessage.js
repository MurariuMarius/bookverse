const redirectToPageWithMessage = (router, page, message, type) => {
    if (router.currentRoute.value.name === 'admin') {
      page = 'admin'
    }

    router.push({ name: page, query: { msg:  message, s: window.scrollY, t: type }})
          setTimeout(() => {
            router.go()
          }, 100)
}

export default redirectToPageWithMessage