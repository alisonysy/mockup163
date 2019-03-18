{
  let view = {
    search: '#searchBar',
    form: '#search',
    wrapper:'.results-wrapper',
    result:'.results',
    liTemplate:`
    <li>
    <a href="./playSong.html?id=__id__">
      <div class="p3-song-wrapper">
        <h4>__title__</h4>
        <h6 isHQ="__val__">__singer__ - __album__</h6>
      </div>
      <div class="p3-play">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
        </svg>
      </div>
    </a>
    </li>
    `,
    renderLi(arrObj){
      let results = $(this.result)[0];
      results.innerHTML='';
      let placeholders = ['id','title','singer','album'];
      arrObj.map((song)=>{
        let template = this.liTemplate;
        placeholders.map((ii)=>{
          template = template.replace(`__${ii}__`,song[ii]||'');
        });
        if(song.isHQ==="1"){
          template = template.replace('<h6 isHQ="__val__">',"<h6 isHQ='HQ' class='active'>")
        }else{
          template = template.replace(' isHQ="__val__"','')
        }
        $(results).prepend(template);
      })
    }
  };
  let model = {
    data: {},
    db_data: [],
    encodedSongArr:[],
    results:[],
    songli:[],
    turnIntoArr(arrObj) {
      let placeholders = ['title', 'singer', 'album'];
      let allSongArr = [];
      arrObj.map((obj) => {
        let songArr = [];
        songArr[0] = 'id:' + obj.id;
        placeholders.map((i) => {
          songArr.push(obj[i]);
        })
        allSongArr.push(songArr);
      });
      return allSongArr;
    },
    findSong(arr){
      this.songli=[];
      arr.map((id)=>{
        id = id.split('id:')[1];
        let query = new AV.Query('Song');
        let temp={};
        return query.get(id).then((res)=>{
          temp = res.attributes;
          temp.id = res.id;
          this.songli.push(temp);
        })
          .then(()=>{
            window.eventHub.emit('findSong',this.songli);
          })
      })
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.bindEvent();
      window.eventHub.on('search', (searchVal) => {
        console.log(searchVal);
        this.model.results=this.match(this.model.encodedSongArr,this.encodeUnicode(searchVal));
        window.eventHub.emit('result',this.model.results);
      });
      window.eventHub.on('find', (data) => {
        Object.assign(this.model.db_data, data);
        this.model.encodedSongArr =this.encodeDatabase(this.model.db_data); //this returns an arr;
      });
      window.eventHub.on('result',(data)=>{
        this.model.findSong(data);
      });
      window.eventHub.on('findSong',(data)=>{
        this.view.renderLi(data);
      })
    },
    bindEvent() {
      this.getSearchVal();
      $(this.view.form).submit((e) => {
        e.preventDefault();
        let form = e.currentTarget;
        let bar = $(form).find('input')[0];
        window.eventHub.emit('search', bar.value);
      });
    },
    getSearchVal() {
      const debounce = (func, delay) => {
        let inDebounce;
        return function () {
          const ctx = this;
          const args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(() => {
            func.apply(ctx, args)
          }, delay);
        }
      };
      $(this.view.search).on('keydown',
        debounce(() => {
          $(this.view.form).submit();
        }, 1000))
    },
    encodeDatabase(arrObj) {
      let songArr = this.model.turnIntoArr(arrObj);
      let arr=[]
      songArr.map((song) => {
        let encodedArr=[];
        encodedArr[0]=song[0];
        song.map((i, index) => {
          if(index>0){
            encodedArr.push(this.encodeUnicode(i)) ;
          }
        })
        arr.push(encodedArr);
      })
      return arr;
    },
    match(arrArr,input){
      let idArr = [];
      //let data match user input;
      arrArr.map((song)=>{
        let id = song[0];
        song.map((i,index)=>{
          if(index>0 && index<3){
            i=i.replace(/\?/g,'\\?')
            let re = new RegExp(i,'g');
            if(re.test(input) && idArr.indexOf(id)===-1){
              idArr.push(id);
            }else{
              return;
            }
          }
        })
      });
      return idArr;
    },
    encodeUnicode(str) {
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
      }
      return '?' + arr.join('?');
    },
    decodeUnicode(str) {
      str = str.replace(/\\/g, "%");
      return unescape(str);
    }
  };
  controller.init(view, model);
}