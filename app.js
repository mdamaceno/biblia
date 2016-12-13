const jsonata = require('./node_modules/jsonata/jsonata.js')
const Vue = require('./node_modules/vue/dist/vue.js')
const VueResource = require('./node_modules/vue-resource/dist/vue-resource.js')

Vue.use(VueResource)

var bookVM = new Vue({
    el: '#app',
    data: {
        book: {
            verse: '',
            chapterNumbers: [],
            chapterVerses: []
        },
        books: {},
        versions: [
            'Nova Versão Internacional (NVI)',
            'Almeida Corrigida e Fiel (ACF)',
            'Almeida Revisada Imprensa Bíblica (AA)'
        ],
        control: {
            showListBook: true,
            showChapterNumbers: false,
            showBackButton: false,
            showChapterVerses: false,
            boldChapter: 0,
            selectedBook: {},
            selectedVersion: {}
        }
    },
    mounted: function() {
        var _this = this

        Promise.resolve(_this.parseData())
            .then(function() {
                _this.control.selectedVersion = {
                    index: 0,
                    name: _this.versions[0]
                }
            })
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
        },

        setColorBg: function(index) {
            var _this = this
            var index = parseInt(index)

            if (index <= 4) {
                return "bg-blue-400"
            } else if (index <= 16) {
                return "bg-green-600"
            } else if (index <= 21) {
                return "bg-pink-300"
            } else if (index <= 26) {
                return "bg-danger"
            } else if (index <= 38) {
                return "bg-brown-400"
            } else if (index <= 42) {
                return "bg-teal-600"
            } else if (index <= 43) {
                return "bg-violet"
            } else if (index <= 56) {
                return "bg-danger-400"
            } else if (index <= 64) {
                return "bg-indigo-300"
            } else if (index <= 65) {
                return "bg-orange-400"
            } else {
                return ""
            }
        },

        setVersion: function(index) {
            var _this = this

            _this.control.selectedVersion = {
                index: index,
                name: _this.versions[index]
            }
        }
    }
})
