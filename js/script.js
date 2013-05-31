(function (window, undefined) {
    if (!window['kp']) {
        window.kp = {}
        kp.init = function () {
            return new kp.SlotMachine()
        }

    }
})(window);
(function ($) {
    kp.Slot = function (itemCount, vendor, rotateX, translateZ, items, colors) {
        var transform = {
            translateZ: -translateZ + 'px',
            rotateX: '0deg',
            duration: 0
        }
        this.element = $('<div class="slot">')

        for (var j = 0; j < itemCount; j++) {
            this.element.append('<figure style="' + vendor + 'transform' + ': rotateX(' + j * rotateX + 'deg) translateZ(' + translateZ + 'px)' + ';">' +
            '<i class=' + items[j] + '></i>' +
            '</figure>')
        }
        this.spin = function () {
            transform.rotateX = '45deg'
            transform.duration = 1000
            var self = this
            self.element.removeClass('notran')
            self.animate(function () {
                transform.rotateX = '-1800deg'
                transform.duration = 3000
                self.animate(function () {
                    transform.rotateX = '0deg'
                    self.element.addClass('notran')
                    self.element.css(vendor + 'transform', 'translateZ(' + transform.translateZ + ') rotateX(' + transform.rotateX + ')')
                })
            }, 200)
        }
        this.animate = function (callback) {
            this.element.css(vendor + 'transform', 'translateZ(' + transform.translateZ + ') rotateX(' + transform.rotateX + ')')
                .css({
                    'tranform-duration': transform.duration / 1000 + 's',
                })
            setTimeout(
                function () {
                    if (callback)
                        callback.call()
                }, transform.duration)
        }
        this.animate()
    }

    kp.SlotMachine = function () {
        this.$element = $('#slotMachine')
        var slotCount = 5,
            itemCount = 12,
            slotSize = this.$element.height()

        this.vendor =
            (/webkit/i).test(navigator.appVersion) ? '-webkit-' :
            (/firefox/i).test(navigator.userAgent) ? '-moz-' :
            (/msie/i).test(navigator.userAgent) ? 'ms-' :
            'opera' in window ? '-o-' : '';

        this.items = [
           'icon-smile',
           'icon-meh',
           'icon-frown',
           'icon-heart',
           'icon-star',
           'icon-money',
           'icon-beaker',
           'icon-exclamation-sign',
           'icon-bolt',
           'icon-food',
           'icon-glass',
           'icon-globe'
        ];
        this.slots = []

        var rotateX = 360 / itemCount
        this.translateZ = Math.round((slotSize / 2) / Math.tan(Math.PI / itemCount))
        for (var i = 0; i < slotCount; i++) {
            var slotItems = this.createShuffle(itemCount)
            var slot = new kp.Slot(itemCount, this.vendor, rotateX, this.translateZ, slotItems)
            this.$element.append($('<div class="reel">').append(slot.element))
            this.slots.push(slot)
        }
        this.$element.css({
            'width': slotCount * slotSize + 'px',
            'margin-top': slotSize + 'px',
            'margin-bottom': slotSize + 'px'
        })
    }
    kp.SlotMachine.prototype.createShuffle = function (itemCount) {
        var array = this.items.slice(0)
        //for (var i = 0; i < itemCount; i++)
        //    array.push(this.items[i % this.items.length])
        for (i = array.length - 1; i > 0; i--) {
            var j = parseInt(Math.random() * i)
            var tmp = array[i];
            array[i] = array[j]
            array[j] = tmp;
        }
        return array
    }
    kp.SlotMachine.prototype.Play = function () {
        var animate = function (idx, self) {
            return function () {
                var slot = self.slots[idx]
                slot.spin(360 / self.slots.length)
            }
        }
        for (var i = 0; i < this.slots.length; i++) {
            setTimeout(animate(i, this), 200 * (i + 1))
        }
    }

    kp.SlotMachine.prototype.ShowInnards = function (show) {
        if (show) {
            this.$element.addClass('seeth')
            this.$element.css(this.vendor + 'transform',
                 'rotateY(60deg) translateX(' + 2 * this.translateZ + 'px)'
                )
        }
        else {
            this.$element.css(this.vendor + 'transform',
                'rotateY(0deg) translateX(0px)'
               )
            var $elem = this.$element
            setTimeout(function () {
                $elem.removeClass('seeth')
            }, 1000)
        }
    }

    kp.SlotMachine.prototype.FlatPerspective = function () {
        this.$element.toggleClass('preserve')
    }
})(jQuery);
$(function () {
    var slotMachine = kp.init();
    $('#btnSpin').on('click', function () {
        slotMachine.Play()
    })
    $('#chInnards').on('change', function () {
        slotMachine.ShowInnards(this.checked)
    })
    $('#chFlat').on('click', function () {
        slotMachine.FlatPerspective()
    })
});