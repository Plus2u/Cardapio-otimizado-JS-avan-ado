// Contagem regressiva das ofertas: termina à meia-noite local do dia da visita.
(() => {
  const horasEl = document.getElementById("contador-horas");
  const minutosEl = document.getElementById("contador-minutos");
  const segundosEl = document.getElementById("contador-segundos");
  const contadorEl = document.getElementById("contador-ofertas");

  // As outras páginas não possuem o contador, então o script não faz nada nelas.
  if (!horasEl || !minutosEl || !segundosEl || !contadorEl) return;

  const agora = new Date();
  const prazo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0, 0);
  const formatar = (valor) => String(valor).padStart(2, "0");

  function atualizarContador() {
    const restanteMs = Math.max(0, prazo.getTime() - Date.now());
    const totalSegundos = Math.floor(restanteMs / 1000);
    horasEl.textContent = formatar(Math.floor(totalSegundos / 3600));
    minutosEl.textContent = formatar(Math.floor((totalSegundos % 3600) / 60));
    segundosEl.textContent = formatar(totalSegundos % 60);

    if (restanteMs <= 0) {
      clearInterval(intervalo);
      contadorEl.setAttribute("aria-label", "As ofertas de hoje terminaram");
    }
  }

  atualizarContador();
  const intervalo = setInterval(atualizarContador, 1000);
})();
