# Andaluz Gastronomia, site v2

Site de 5 páginas com movimento (GSAP 3.13 + ScrollTrigger + SplitText, rolagem suave com Lenis), inspirado na estrutura do zonta-salgados.vercel.app, com a identidade da Andaluz.

Rodar local:

    cd "/Users/gringo/Projects/Site Andaluz/site-v2"
    python3 -m http.server 3040

Abrir http://localhost:3040

- `paginas/*.html`: conteúdo de cada página (editar aqui)
- `build.py`: junta cabeçalho, menu e rodapé e gera index.html, cardapio.html, noite-arabe.html, nossa-historia.html e visite.html. Rodar `python3 build.py` depois de editar.
- Testar sem animação: abrir com `?sem-movimento` no fim do endereço
- `css/style.css`: tokens e layout
- `js/main.js`: movimentos (respeita prefers-reduced-motion)
- `img/`: fotos do Instagram do cliente (substituir pelos originais em alta)

Pendências: link do iFood, ano de fundação, confirmar preço da noite árabe (R$ 85 é da edição de setembro/2026), fotos originais e logo em vetor.

## Publicação

- GitHub (privado): https://github.com/Gringadas/andaluz-gastronomia-site
- Vercel: time `gringo1`, projeto `andaluz-gastronomia-site`, https://andaluz-gastronomia-site.vercel.app
- Integração Git ligada: push na `main` publica em produção; outras branches geram preview.
- Fluxo: editar `paginas/`, rodar `python3 build.py`, commitar o HTML gerado junto.
