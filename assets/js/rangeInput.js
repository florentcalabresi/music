var range_type = 'input[type=range]';
var range_mousedown = false;
var left;

$(range_type).each(function () {
  var thumb = $('<span class="thumb"><span class="value"></span></span>');
  $(this).after(thumb);
});

var showRangeBubble = function (thumb) {
  var paddingLeft = parseInt(thumb.parent().css('padding-left'));
  var marginLeft = -7 + paddingLeft + 'px';
  thumb.velocity({ height: "30px", width: "30px", top: "-30px", marginLeft: marginLeft }, { duration: 300, easing: 'easeOutExpo' });
};

var calcRangeOffset = function (range) {
  var width = range.width() - 15;
  var max = parseFloat(range.attr('max'));
  var min = parseFloat(range.attr('min'));
  var percent = (parseFloat(range.val()) - min) / (max - min);
  return percent * width;
};

var range_wrapper = '.range-field';
$(document).on('change', range_type, function (e) {
  var thumb = $(this).siblings('.thumb');
  thumb.find('.value').html($(this).val());

  if (!thumb.hasClass('active')) {
    showRangeBubble(thumb);
  }

  var offsetLeft = calcRangeOffset($(this));
  thumb.addClass('active').css('left', offsetLeft);
});

$(document).on('mousedown touchstart', range_type, function (e) {
  var thumb = $(this).siblings('.thumb');

  // If thumb indicator does not exist yet, create it
  if (thumb.length <= 0) {
    thumb = $('<span class="thumb"><span class="value"></span></span>');
    $(this).after(thumb);
  }

  // Set indicator value
  thumb.find('.value').html($('#lblTime').html());

  range_mousedown = true;
  $(this).addClass('active');

  if (!thumb.hasClass('active')) {
    showRangeBubble(thumb);
  }

  if (e.type !== 'input') {
    var offsetLeft = calcRangeOffset($(this));
    thumb.addClass('active').css('left', offsetLeft);
  }
});

$(document).on('mouseup touchend', range_wrapper, function () {
  range_mousedown = false;
  $(this).removeClass('active');
});

$(document).on('input mousemove touchmove', range_wrapper, function (e) {
  var thumb = $(this).children('.thumb');
  var left;
  var input = $(this).find(range_type);

  if (range_mousedown) {
    if (!thumb.hasClass('active')) {
      showRangeBubble(thumb);
    }

    var offsetLeft = calcRangeOffset(input);
    thumb.addClass('active').css('left', offsetLeft);
    thumb.find('.value').html(thumb.siblings(range_type).val());
  }
});

$(document).on('mouseout touchleave', range_wrapper, function () {
  if (!range_mousedown) {

    var thumb = $(this).children('.thumb');
    var paddingLeft = parseInt($(this).css('padding-left'));
    var marginLeft = 7 + paddingLeft + 'px';

    if (thumb.hasClass('active')) {
      thumb.velocity({ height: '0', width: '0', top: '10px', marginLeft: marginLeft }, { duration: 100 });
    }
    thumb.removeClass('active');
  }
});