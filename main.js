 /*****************************************************************
     * Sample dataset (recipes.json)
     * You can move this JSON to a separate file `recipes.json` and do:
     * fetch('recipes.json').then(r=>r.json()).then(init)
     *****************************************************************/
    const SAMPLE_DATA = [
      {
        "id":"r1",
        "title":"Grandma's Cinnamon Rolls",
        "author":"Eleanor Smith",
        "category":"Dessert",
        "img":"https://images.unsplash.com/photo-1512058564366-c9e1d76d2b8d?auto=format&fit=crop&w=800&q=60",
        "ingredients":["3 cups flour","1 cup milk","2 tsp yeast","1/2 cup sugar","Cinnamon to taste"],
        "instructions":"1. Warm the milk and dissolve yeast.\n2. Mix with flour and sugar. Knead.\n3. Let rise for 1 hour.\n4. Roll, add cinnamon mixture, slice, bake at 375°F for 18-22 minutes."
      },
      {
        "id":"r2",
        "title":"Aunt May's Chicken Soup",
        "author":"May Carter",
        "category":"Main course",
        "img":"https://images.unsplash.com/photo-1516685018646-549c3dba5e4e?auto=format&fit=crop&w=800&q=60",
        "ingredients":["1 whole chicken","3 carrots","2 stalks celery","1 onion","Salt & pepper"],
        "instructions":"Place chicken in a large pot. Add vegetables and cover with water. Simmer 1.5-2 hours. Remove chicken, shred meat, return to pot. Season and serve."
      },
      {
        "id":"r3",
        "title":"Great-Grandpa's Lemon Bars",
        "author":"William Brown",
        "category":"Dessert",
        "img":"https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=60",
        "ingredients":["2 cups sugar","3 lemons (zest & juice)","1 cup butter","2 cups flour"],
        "instructions":"Make crust with butter & flour. Bake 12 minutes at 350°F. Mix sugar + lemon juice + eggs; pour over crust and bake another 20 minutes."
      }
    ];

    /* ---------- Small 'API' helpers ---------- */
    async function loadRecipes(){
      // If you want the JSON in separate file:
      // try { return await fetch('recipes.json').then(r=>r.json()); }
      // catch(err){ console.warn('fetch failed, falling back to SAMPLE_DATA', err) }
      return SAMPLE_DATA;
    }

    function makeCard(recipe){
      const div = document.createElement('div');
      div.className = 'card';
      div.tabIndex = 0;
      div.setAttribute('role','listitem');
      div.dataset.id = recipe.id;
      div.innerHTML = `
        <div class="thumb"><img src="${recipe.img || ''}" alt="${escapeHtml(recipe.title)}"></div>
        <div>
          <p class="meta"><span class="category">${escapeHtml(recipe.category)}</span><span style="font-size:.8rem;color:var(--muted)">${escapeHtml(recipe.author)}</span></p>
          <h4 class="title">${escapeHtml(recipe.title)}</h4>
        </div>
      `;
      div.addEventListener('click',()=>openRecipe(recipe.id));
      div.addEventListener('keypress',e=>{ if(e.key==='Enter') openRecipe(recipe.id) });
      return div;
    }

    /* ---------- App state & DOM refs ---------- */
    const state = {
      all: [],
      filtered: [],
      q: '',
      author: '',
      category: ''
    };
    const refs = {
      results: document.getElementById('results'),
      q: document.getElementById('q'),
      authorSelect: document.getElementById('authorSelect'),
      categorySelect: document.getElementById('categorySelect'),
      noResults: document.getElementById('noResults'),
      modalBackdrop: document.getElementById('modalBackdrop'),
      modalTitle: document.getElementById('modalTitle'),
      modalMeta: document.getElementById('modalMeta'),
      modalIngredients: document.getElementById('modalIngredients'),
      modalInstructions: document.getElementById('modalInstructions'),
      savedTitle: document.getElementById('savedTitle'),
      openSaved: document.getElementById('openSaved'),
      saveFavorite: document.getElementById('saveFavorite')
    };

    /* ---------- Init ---------- */
    (async function init(){
      state.all = await loadRecipes();
      populateFilters(state.all);
      // load saved state from localStorage (author & last-viewed)
      const savedAuthor = localStorage.getItem('preferredAuthor');
      const lastViewed = localStorage.getItem('lastViewedRecipeId');
      if(savedAuthor){
        state.author = savedAuthor;
        refs.authorSelect.value = savedAuthor;
      }
      if(lastViewed){
        const r = state.all.find(x=>x.id===lastViewed);
        refs.savedTitle.textContent = r ? r.title : '—';
      }
      bindEvents();
      applyFilters();
    })();

    function populateFilters(list){
      const authors = Array.from(new Set(list.map(r=>r.author))).sort();
      const categories = Array.from(new Set(list.map(r=>r.category))).sort();
      for(const a of authors){
        const opt = document.createElement('option'); opt.value = a; opt.textContent = a;
        refs.authorSelect.appendChild(opt);
      }
      for(const c of categories){
        const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
        refs.categorySelect.appendChild(opt);
      }
    }

    function bindEvents(){
      refs.q.addEventListener('input', e=>{
        state.q = e.target.value.trim();
        applyFilters();
      });
      refs.authorSelect.addEventListener('change', e=>{
        state.author = e.target.value;
        localStorage.setItem('preferredAuthor', state.author || '');
        applyFilters();
      });
      refs.categorySelect.addEventListener('change', e=>{
        state.category = e.target.value;
        applyFilters();
      });
      document.getElementById('clearBtn').addEventListener('click', ()=>{
        refs.q.value = ''; refs.authorSelect.value = ''; refs.categorySelect.value = '';
        state.q=''; state.author=''; state.category='';
        applyFilters();
      });

      // modal controls
      document.getElementById('closeModal').addEventListener('click', closeModal);
      refs.modalBackdrop.addEventListener('click', e=>{ if(e.target === refs.modalBackdrop) closeModal() });

      refs.openSaved.addEventListener('click', ()=>{
        const last = localStorage.getItem('lastViewedRecipeId');
        if(last) openRecipe(last);
        else alert('No saved recipe yet.');
      });

      refs.saveFavorite.addEventListener('click', ()=>{
        // store a little meta: last viewed recipe id is already stored on openRecipe call
        alert('Saved to localStorage.');
      });

      // keyboard escape to close modal
      document.addEventListener('keydown', e=>{
        if(e.key === 'Escape' && refs.modalBackdrop.style.display === 'flex') closeModal();
      });
    }

    function applyFilters(){
      const q = state.q.toLowerCase();
      state.filtered = state.all.filter(r=>{
        if(state.author && r.author !== state.author) return false;
        if(state.category && r.category !== state.category) return false;
        if(q){
          const hay = (r.title + ' ' + r.ingredients.join(' ') + ' ' + r.author + ' ' + r.category).toLowerCase();
          return hay.includes(q);
        }
        return true;
      });
      renderList();
    }

    function renderList(){
      refs.results.innerHTML = '';
      if(state.filtered.length === 0){
        refs.noResults.style.display = 'block';
        return;
      } else {
        refs.noResults.style.display = 'none';
      }
      for(const r of state.filtered){
        refs.results.appendChild(makeCard(r));
      }
    }

    /* ---------- Open recipe: modal & persist ---------- */
    function openRecipe(id){
      const recipe = state.all.find(x=>x.id === id);
      if(!recipe) return;
      refs.modalTitle.textContent = recipe.title;
      refs.modalMeta.textContent = `${recipe.author} • ${recipe.category}`;
      refs.modalIngredients.innerHTML = '<strong>Ingredients</strong><ul>' + recipe.ingredients.map(i=>`<li>${escapeHtml(i)}</li>`).join('') + '</ul>';
      refs.modalInstructions.textContent = recipe.instructions;
      // show modal
      refs.modalBackdrop.style.display = 'flex';
      refs.modalBackdrop.setAttribute('aria-hidden','false');
      // save last viewed to localStorage
      localStorage.setItem('lastViewedRecipeId', recipe.id);
      refs.savedTitle.textContent = recipe.title;
    }
    function closeModal(){
      refs.modalBackdrop.style.display = 'none';
      refs.modalBackdrop.setAttribute('aria-hidden','true');
    }

    /* ---------- small util ---------- */
    function escapeHtml(str){
      return String(str)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }
