var bookVM = new Vue({
    el: '#app',
    data: {
        book: {
            verse: '',
            chapterNumbers: [],
            chapterVerses: []
        },
        books: {},
        control: {
            showListBook: true,
            showChapterNumbers: false,
            showBackButton: false,
            showChapterVerses: false,
            boldChapter: 0,
            selectedBook: {}
        }
    },
    mounted: function() {
        var _this = this

        Promise.resolve(_this.parseData())
    },
    methods: {
        parseData: function() {
            var _this = this
            var p1 = new Promise(function(resolve, reject) {
                _this.$http.get('./data/nvi.json').then((response) => {
                    resolve(JSON.parse(response.data))
                }, (response) => {
                    reject(response.data)
                })
            })

            p1.then(function(data) {
                _this.books = data
            })
        },

        getBook: function(index) {
            var _this = this
            var result = jsonata('$[' + parseInt(index) + '].chapters').evaluate(_this.books)

            // Controllers
            _this.book.chapterNumbers = []
            _this.control.showListBook = false
            _this.control.showChapterNumbers = true
            _this.control.showBackButton = true
            _this.control.selectedBook = {
                index: index,
                title: _this.books[index].book
            }

            var i = 0
            for (var r in result) {
                _this.book.chapterNumbers.push(i + 1)
                i++
            }
        },

        getText: function(book, chapter) {
            var _this = this
            var result = jsonata('$[' + parseInt(book) + '].chapters[' + (parseInt(chapter) - 1) + ']').evaluate(_this.books)

            // Controllers
            _this.control.showChapterVerses = true
            _this.control.boldChapter = parseInt(chapter)

            _this.book.chapterVerses = result[chapter]
        },

        goToListBook: function() {
            var _this = this

            // Controllers
            _this.control.showListBook = true
            _this.control.showChapterNumbers = false
            _this.control.showBackButton = false
            _this.control.showChapterVerses = false
            _this.control.boldChapter = 0
            _this.control.selectedBook = {}

            _this.parseData()
        }
    }
})
