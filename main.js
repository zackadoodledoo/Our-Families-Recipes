 /*****************************************************************
     * Sample dataset (recipes.json)
     * You can move this JSON to a separate file `recipes.json` and do:
     * fetch('recipes.json').then(r=>r.json()).then(init)
     *****************************************************************/
    const SAMPLE_DATA = [
      {
        "id":"r1",
        "title":"Grandma's  Cinnamon Rolls",
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

    