{
  let view = {
    search: '#searchBar',
    form: '#search'
  };
  let model = {
    data: {},
    db_data: [],
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
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.bindEvent();
      window.eventHub.on('search', (searchVal) => {
        console.log(searchVal);
      });
      window.eventHub.on('find', (data) => {
        Object.assign(this.model.db_data, data);
        this.encodeDatabase(this.model.db_data);
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
        }, 750))
    },
    encodeDatabase(arrObj) {
      let songArr = this.model.turnIntoArr(arrObj);
      console.log(songArr);
      songArr.map((song) => {
        song.map((i, index) => {
          if(index>0){
            let a = this.encodeUnicode(i);
            console.log(a)
          }
        })
      })
    },
    encodeUnicode(str) {
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
      }
      return '\\u' + arr.join('\\u');
    },
    decodeUnicode(str) {
      str = str.replace(/\\/g, "%");
      return unescape(str);
    }
  };
  controller.init(view, model);
}