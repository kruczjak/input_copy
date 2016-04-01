(function() {
    var InputCopy = window.InputCopy = function(tooltipOpts, manualTooltipEnabled, manualTooltipContent) {
        this.tooltipDuration = 1000; //ms
        this.copySupported = !!document.queryCommandSupported("copy");
        this.tooltipOpts = tooltipOpts || {
                content: 'Copied to clipboard!',
                container: 'body',
                placement: 'top',
                trigger: 'manual'
            };
        this.manualTooltipEnabled = manualTooltipEnabled;
        this.manualTooltipContent = manualTooltipContent;

        this.initiatorClickHandler = function()  {
            this.clearTimeout();
            this.input.select();

            try {
                if (!this.copySupported) throw 'Copy not supported';
                document.execCommand('copy'); //can throw exception

                this.showPopover(this.tooltipOpts);
            } catch (e) {
                if (this.manualTooltipEnabled) this.manualTooltip();
            }
        };

        this.showPopover = function(settings) {
            var self = this;

            this.initiator.popover(settings);
            this.initiator.popover('show');

            this.timer = setTimeout(function() { self.initiator.popover('destroy') }, this.tooltipDuration);
            $(document).one('page:before-change', function() { clearTimeout(self.timer) });
        };

        this.clearTimeout = function()  {
            if (!!this.timer) clearTimeout(this.timer);
        };

        this.manualTooltip = function() {
            var clonedOpts = JSON.parse(JSON.stringify(this.tooltipOpts));
            clonedOpts['content'] = this.manualTooltipContent || 'Please, copy it manually';
            this.showPopover(clonedOpts)
        };
    };

    InputCopy.prototype.init = function(initiatorId, inputId)  {
        var self = this;

        this.input = $(inputId);
        this.initiator = $(initiatorId);

        this.initiator.click(function() {
            self.initiatorClickHandler();
        });

        return this.initiator;
    };

    InputCopy.prototype.hideTooltip = function()  {
        this.initiator.popover('destroy');
        clearTimeout(this.timer);
    }
}).call(this);