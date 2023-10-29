const redirectToPageWithMessage = (router, page, message, type) => {
    router.push({ name: page, query: { msg:  message, s: window.scrollY, t: type }})
          setTimeout(() => {
            router.go()
          }, 100)
}

export default redirectToPageWithMessage