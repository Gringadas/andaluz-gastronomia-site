"""Monta as paginas do site a partir de paginas/*.html com cabecalho e rodape compartilhados.
Uso: python3 build.py  (gera index.html, cardapio.html, noite-arabe.html, nossa-historia.html, visite.html)
"""
import pathlib
import time

VER = str(int(time.time()))

RAIZ = pathlib.Path(__file__).parent
ZAP = "https://wa.me/5511988937499"
MAPA = "https://www.google.com/maps/search/?api=1&amp;query=Andaluz+Gastronomia+Mercad%C3%A3o+da+Ferrovi%C3%A1rios+Jundia%C3%AD"

PAGINAS = [
    # arquivo de saida, fragmento, titulo, descricao, item ativo do menu
    ("index.html", "inicio.html", "Andaluz Gastronomia | Comida árabe de família em Jundiaí",
     "Bufê de comida árabe tradicional da família Chedid Ayache no Mercadão da Ferroviários, em Jundiaí.", ""),
    ("cardapio.html", "cardapio.html", "Cardápio | Andaluz Gastronomia",
     "Esfihas, kibe, tabule, homus, charutos e doces árabes do bufê do Andaluz, em Jundiaí.", "cardapio"),
    ("noite-arabe.html", "noite-arabe.html", "Noite árabe | Andaluz Gastronomia",
     "Bufê árabe à vontade e dança do ventre no Andaluz, Mercadão da Ferroviários, Jundiaí.", "noite"),
    ("nossa-historia.html", "nossa-historia.html", "Nossa história | Andaluz Gastronomia",
     "A história da família Chedid Ayache e do Andaluz, sete vezes Prêmio Destaque em Jundiaí.", "historia"),
    ("visite.html", "visite.html", "Visite | Andaluz Gastronomia",
     "Endereço, horários do salão e do iFood e como pedir no Andaluz Gastronomia, em Jundiaí.", "visite"),
]

MENU = [("cardapio", "cardapio.html", "Cardápio"), ("noite", "noite-arabe.html", "Noite árabe"),
        ("historia", "nossa-historia.html", "Nossa história"), ("visite", "visite.html", "Visite")]


def menu(ativo, classe=""):
    itens = []
    for chave, href, nome in MENU:
        atual = ' aria-current="page"' if chave == ativo else ""
        itens.append(f'<a href="{href}"{atual}{classe}>{nome}</a>')
    return "\n    ".join(itens)


def layout(titulo, descricao, ativo, corpo, pagina):
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{descricao}">
<meta name="theme-color" content="#1A0B0D">
<script>document.documentElement.classList.add("js");if("scrollRestoration" in history)history.scrollRestoration="manual";try{{if(sessionStorage.getItem("cortina")){{document.documentElement.classList.add("chegando");sessionStorage.removeItem("cortina")}}}}catch(e){{}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rakkas&family=Proza+Libre:wght@400;500;600;700&family=Aref+Ruqaa:wght@400;700&display=swap">
<link rel="stylesheet" href="css/style.css?v={VER}">
</head>
<body data-pagina="{pagina}">

<div class="cortina" aria-hidden="true"><img src="img/logo-light.png" alt=""></div>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<header class="nav" id="nav">
  <a class="nav-logo" href="index.html" aria-label="Andaluz Gastronomia, página inicial"><img src="img/logo-light.png" alt="Andaluz Gastronomia" width="104" height="50"></a>
  <nav aria-label="Páginas">
    {menu(ativo)}
  </nav>
  <a class="pill pill-zap nav-cta" href="{ZAP}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-zap"/></svg>Pedir no WhatsApp</a>
  <button class="nav-menu" type="button" aria-expanded="false" aria-controls="menu-movel"><span></span><span></span><b>Menu</b></button>
</header>

<div class="menu-movel" id="menu-movel" hidden>
  <nav aria-label="Páginas">
    <a href="index.html"{' aria-current="page"' if not ativo else ''}>Início</a>
    {menu(ativo)}
  </nav>
  <a class="pill pill-zap" href="{ZAP}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-zap"/></svg>Pedir no WhatsApp</a>
  <p>Mercadão da Ferroviários, Jundiaí · terça a domingo, 11h às 15h</p>
</div>

<main id="conteudo">
{corpo}
</main>

<footer class="rodape">
  <div class="rodape-grade">
    <p class="rodape-frase">Da nossa família para a sua.</p>
    <div><h4>Navegue</h4><ul><li><a href="index.html">Início</a></li>{''.join(f'<li><a href="{h}">{n}</a></li>' for _, h, n in MENU)}</ul></div>
    <div><h4>Fale com a gente</h4><ul class="contatos">
      <li><a href="{ZAP}" target="_blank" rel="noopener"><span class="ic ic-zap"><svg aria-hidden="true"><use href="#i-zap"/></svg></span>(11) 98893-7499</a></li>
      <li><a href="https://www.instagram.com/andaluz.gastronomia/" target="_blank" rel="noopener"><span class="ic ic-insta"><svg aria-hidden="true"><use href="#i-insta"/></svg></span>@andaluz.gastronomia</a></li>
    </ul></div>
    <div><h4>Onde estamos</h4><p>Mercadão da Ferroviários<br>Jundiaí, SP · 13201-007</p><p class="horas">Salão: terça a domingo, 11h às 15h<br>iFood: quarta a sábado até 21h30, domingo até 15h</p></div>
  </div>
  <div class="rodape-base"><span>© 2026 Andaluz Gastronomia</span><button class="pausa" id="pausa" type="button" aria-pressed="false">Pausar animações</button><span>Comida árabe de família em Jundiaí</span></div>
</footer>

<a class="zap-flutua" href="{ZAP}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><svg aria-hidden="true"><use href="#i-zap"/></svg></a>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-zap" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2.1 1.3 2.4 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z"/></symbol>
  <symbol id="i-seta" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12h13M13 6l6 6-6 6"/></symbol>
  <symbol id="i-insta" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></symbol>
</svg>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="js/main.js?v={VER}"></script>
</body>
</html>
"""


for saida, frag, titulo, desc, ativo in PAGINAS:
    corpo = (RAIZ / "paginas" / frag).read_text(encoding="utf-8")
    corpo = corpo.replace("{ZAP}", ZAP).replace("{MAPA}", MAPA)
    (RAIZ / saida).write_text(layout(titulo, desc, ativo, corpo, frag.replace(".html", "")), encoding="utf-8")
    print("gerado", saida)
