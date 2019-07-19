Vue.component('media', {
  props: ['_id',
    'UsageClass',
    'CheckoutType',
    'MaterialType',
    'CheckoutYear',
    'Checkouts',
    'Title',
    'Creator',
    'Subjects',
    'Publisher',
    'PublicationYear'],
  template: `
    <div class="col col-md-6 col-xl-4">
      <article class="card mt-5"> 
        <section class="card-header"> 
          by: {{ Creator }}
        </section>
        <section class="card-body">
          <h5 class="card-title text-center text-truncate"> {{ trimTitle(Title) }} </h5>
          <p class="card-text"> 
            <span class="font-weight-bold"> Category:</span> 
            <span class="font-weight-normal"> {{ MaterialType }} </span>
          </p>
          <p class="card-text"> 
            <span class="font-weight-bold"> Subjects:</span> 
            <span class="font-weight-normal"> {{ Subjects }} </span>
          </p>
          <p class="card-text"> 
            <span class="font-weight-bold"> Publisher:</span> 
            <span class="font-weight-normal"> {{ Publisher }} </span>
          </p>
          <p class="card-text"> 
            <span class="font-weight-bold"> PublicationYear:</span> 
            <span class="font-weight-normal"> {{ PublicationYear }} </span>
          </p>
        </section>

        <div class="card-footer text-muted">
          <a class="nav-item nav-link" :href="'#/id/'+ _id">
            id: {{ _id }}
          </a>
        </div>

      </article>
    </div>
    `,
  methods: {
    trimTitle: (str) => {
      let arr = [];
      let newStr = '';

      if (str && str.includes('/')) {
        arr = str.split(' / ');
        newStr = arr[0];
        //newStr = newStr.slice(1);
        if (newStr.includes('[')) {
          arr = newStr.split(' [');
          newStr = arr[0];
        }
        str = newStr;
      }
      return str;
    },
  }
});

Vue.component('media-list', {
  props: ['mediaItems'],
  template: `
    <div class="row">
      <media 
        v-for="media in mediaItems"
        :_id ="media._id" 
        :UsageClass="media.UsageClass" 
        :CheckoutType="media.CheckoutType" 
        :MaterialType="media.MaterialType" 
        :CheckoutYear="media.CheckoutYear"
        :Checkouts="media.Checkouts" 
        :Title="media.Title"
        :Creator="media.Creator" 
        :Subjects="media.Subjects"  
        :Publisher="media.Publisher" 
        :PublicationYear="media.PublicationYear"
        :key="media._id"> 
      </media>
    </div>
  `
});

Vue.component('pagination-bar', {
  template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: parseInt($route.params.page || 0)==0}">
            <router-link class="page-link" 
              :to="{ path: '/page/' + (parseInt($route.params.page || 0) - 1) + '?name=' + ($route.query.name || '')}">
              Previous
            </router-link>
          </li>

          <li class="page-item">
            <router-link class="page-link" :to="{ path: '/page/0'  + '?name=' + ($route.query.name || '')}">
              0
            </router-link>
          </li>

          <li class="page-item">
            <router-link class="page-link" :to="{ path: '/page/0'  + '?name=' + ($route.query.name || '')}">
              1
            </router-link>
          </li>

          <li class="page-item">
            <router-link class="page-link" :to="{ path: '/page/0'  + '?name=' + ($route.query.name || '')}">
              2
            </router-link>
          </li>

          <router-link class="page-link" 
            :to="{ path: '/page/' + (parseInt($route.params.page || 0) + 1) + '?name=' + ($route.query.name || '')}"">
            Next
          </router-link>

        </ul>
      </nav>
    `
});

Vue.component('content-and-pagination', {
  props: ['mediaItems'],
  template: `
  <div>
    <pagination-bar></pagination-bar>
    <media-list :mediaItems='mediaItems'></media-list>
    <pagination-bar></pagination-bar>
  </div>
  `
});



const mediaItems = Vue.component('mediaItems', {
  created: function () {
    // change order event listener
    this.$on('filter-bar:orderChanged',
      (ord) => {
        // this.ord gets value from event listener
        this.ord = ord;
        this.getMediaItems(this.$route.params.page);
      })
  },
  mounted: function () {
    //get mediaItems
    
    this.getMediaItems(this.$route.params.page, this.$route.query.name);

  },
  data: function () {
    return {
      ord: 'asc',
      mediaItems: [],
      elemPerPage: 5
    };
  },
  beforeRouteUpdate: function (to, from, next) {
    this.getMediaItems(to.params.page, to.query.name);
    window.scrollTo(0, 0);
    next();
  },
  methods: {
    getMediaItems: function (page, name) {
      let url = `/media?ord=${this.ord}&elemPerPage=${this.elemPerPage}`;

      if (page) {
        url += '&page=' + page;
      }

      if (name) {
        url += '&name=' + name;
      }
      axios(url)
        .then((resp) => {
          this.mediaItems = resp.data;
        });
    },
  },
  template: `
    <article class="container">
      <div class="row">
        <div class="col col-md-2">
          <filter-bar></filter-bar>
        </div> 
        <div class="col col-md-10">
          <content-and-pagination :mediaItems='mediaItems'></content-and-pagination>
        </div> 
      </div> 
    </article>
  `
})

