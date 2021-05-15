window.addEventListener("load", async function() {
  document.getElementById("profileBackground").setAttribute("style",
    await MeownApi(`${category}/${id}`).then(res => {
      return `${document
        .getElementById("profileBackground")
        .getAttribute("style")} background: url(${res.background})||""`;
    })
  );
});
