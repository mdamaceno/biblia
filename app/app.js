const { shell } = require('electron')
const jsonata = require('jsonata')
const Vue = require('vue/dist/vue')
const VueResource = require('vue-resource/dist/vue-resource')

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
    mounted: function () {
        var _this = this

        Promise.resolve(_this.setVersion(0))
    },
    methods: {
        parseData: function (version) {
            var _this = this
            var version = version || 'nvi'
            var jsonDataArr = {
                nvi: './data/nvi.json',
                acf: './data/acf.json',
                aa: './data/aa.json'
            }

            var p1 = new Promise(function (resolve, reject) {
                _this.$http.get(jsonDataArr[version]).then((response) => {
                    resolve(JSON.parse(response.data))
                }, (response) => {
                    reject(response.data)
                })
            })

            p1.then(function (data) {
                _this.books = data
            })
        },

        getBook: function (index) {
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

        getText: function (book, chapter) {
            var _this = this
            var result = jsonata('$[' + parseInt(book) + '].chapters[' + (parseInt(chapter) - 1) + ']').evaluate(_this.books)

            // Controllers
            _this.control.showChapterVerses = true
            _this.control.boldChapter = parseInt(chapter)

            _this.book.chapterVerses = result[chapter]
        },

        goToListBook: function () {
            var _this = this

            // Controllers
            _this.control.showListBook = true
            _this.control.showChapterNumbers = false
            _this.control.showBackButton = false
            _this.control.showChapterVerses = false
            _this.control.boldChapter = 0
            _this.control.selectedBook = {}

            Promise.resolve(_this.setVersion(_this.control.selectedVersion.index))
        },

        setColorBg: function (index) {
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

        setVersion: function (index) {
            var _this = this

            _this.control.selectedVersion = {
                index: index,
                name: _this.versions[index]
            }

            if (index == 0) {
                _this.parseData('nvi')
            } else if (index == 1) {
                _this.parseData('acf')
            } else if (index == 2) {
                _this.parseData('aa')
            } else {
                _this.parseData('nvi')
            }

            // Controllers
            _this.control.showListBook = true
            _this.control.showChapterNumbers = false
            _this.control.showBackButton = false
            _this.control.showChapterVerses = false
            _this.control.boldChapter = 0
            _this.control.selectedBook = {}
        },

        openLinkBrowser: function (url) {
            shell.openExternal(url)
        }
    }
})
