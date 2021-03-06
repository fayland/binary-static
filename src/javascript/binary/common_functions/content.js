const template = require('../base/utility').template;
const localize = require('../base/localize').localize;
const selectorExists = require('../common_functions/common_functions').selectorExists;

const Content = (function() {
    'use strict';

    let localized = {};

    const populate = function() {
        localized = {
            textStartTime                     : 'Start time',
            textSpot                          : 'Spot',
            textBarrier                       : 'Barrier',
            textBarrierOffset                 : 'Barrier offset',
            textHighBarrier                   : 'High barrier',
            textHighBarrierOffset             : 'High barrier offset',
            textLowBarrier                    : 'Low barrier',
            textLowBarrierOffset              : 'Low barrier offset',
            textPayout                        : 'Payout',
            textStake                         : 'Stake',
            textPurchase                      : 'Purchase',
            textDuration                      : 'Duration',
            textEndTime                       : 'End Time',
            textDurationSeconds               : 'seconds',
            textDurationMinutes               : 'minutes',
            textDurationHours                 : 'hours',
            textDurationDays                  : 'days',
            textDurationTicks                 : 'ticks',
            textMinDuration                   : 'min',
            textMinDurationTooltip            : 'minimum available duration',
            textBarrierOffsetTooltip          : 'Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received',
            textIndicativeBarrierTooltip      : 'This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.',
            textContractConfirmationHeading   : 'Contract Confirmation',
            textContractConfirmationReference : 'Your transaction reference is',
            textContractConfirmationBalance   : 'Account balance:',
            textContractConfirmationButton    : 'View',
            textContractConfirmationPayout    : 'Potential Payout',
            textContractConfirmationCost      : 'Total Cost',
            textContractConfirmationProfit    : 'Potential Profit',
            textFormRiseFall                  : 'Rise/Fall',
            textFormHigherLower               : 'Higher/Lower',
            textFormUpDown                    : 'Up/Down',
            textFormInOut                     : 'In/Out',
            textFormMatchesDiffers            : 'Matches/Differs',
            textFormEvenOdd                   : 'Even/Odd',
            textFormOverUnder                 : 'Over/Under',
            textContractPeriod                : 'Period',
            textPredictionLabel               : 'Last Digit Prediction',
            textTickResultLabel               : 'Tick',
            textAmountPerPoint                : 'Amount per point',
            textStopLoss                      : 'Stop-loss',
            textStopProfit                    : 'Stop-profit',
            textStopType                      : 'Stop-type',
            textStopTypePoints                : 'Points',
            textSpreadTypeLong                : 'Long',
            textSpreadTypeShort               : 'Short',
            textSpreadDepositComment          : 'Deposit of',
            textSpreadRequiredComment         : 'is required. Current spread',
            textSpreadPointsComment           : 'points',
            textContractStatusWon             : 'This contract won',
            textContractStatusLost            : 'This contract lost',
            textNow                           : 'Now',
            textDate                          : 'Date',
            textPurchaseDate                  : 'Date (GMT)',
            textPurchasePrice                 : 'Purchase Price',
            textStatement                     : 'Statement',
            textProfitTable                   : 'Profit Table',
            textRef                           : 'Ref.',
            textAction                        : 'Action',
            textDescription                   : 'Description',
            textCreditDebit                   : 'Credit/Debit',
            textBalance                       : 'Balance',
            textDetails                       : 'Details',
            textContract                      : 'Contract',
            textSaleDate                      : 'Sale Date',
            textSalePrice                     : 'Sale Price',
            textBuyPrice                      : 'Buy price',
            textFinalPrice                    : 'Final price',
            textLoss                          : 'Loss',
            textReturn                        : 'Return',
            textNetProfit                     : 'Net profit',
            textProfit                        : 'Profit',
            textProfitLoss                    : 'Profit/Loss',
            textTotalProfitLoss               : 'Total Profit/Loss',
            textUpcomingEvents                : 'Upcoming Events',
            textAsset                         : 'Asset',
            textOpens                         : 'Opens',
            textCloses                        : 'Closes',
            textSettles                       : 'Settles',
            textAuthenticatedWithdrawal       : 'Your account is fully authenticated and your withdrawal limits have been lifted.',
            textWithdrawalLimits              : 'Your withdrawal limit is [_1] [_2].',
            textWithdrawalLimitsEquivalant    : 'Your withdrawal limit is [_1] [_2] (or equivalent in other currency).',
            textWithrawalAmount               : 'You have already withdrawn [_1] [_2].',
            textWithrawalAmountEquivalant     : 'You have already withdrawn the equivalent of [_1] [_2].',
            textCurrentMaxWithdrawal          : 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].',
            textCurrentMaxWithdrawalEquivalant: 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).',
            textWithdrawalLimitsEquivalantDay : 'Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).',
            textWithrawalAmountEquivalantDay  : 'You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.',
            textMessageRequired               : 'This field is required.',
            textMessageCountLimit             : 'You should enter between [_1] characters.', // [_1] should be replaced by a range. sample: (6-20)
            textMessageJustAllowed            : 'Only [_1] are allowed.',      // [_1] should be replaced by values including: letters, numbers, space, period, ...
            textMessageValid                  : 'Please submit a valid [_1].', // [_1] should be replaced by values such as email address
            textLetters                       : 'letters',
            textNumbers                       : 'numbers',
            textSpace                         : 'space',
            textPeriod                        : 'period',
            textComma                         : 'comma',
            textHyphen                        : 'hyphen',
            textApost                         : 'apostrophe',
            textPassword                      : 'password',
            textMr                            : 'Mr',
            textMrs                           : 'Mrs',
            textMs                            : 'Ms',
            textMiss                          : 'Miss',
            textPasswordsNotMatching          : 'The two passwords that you entered do not match.',
            textClickHereToRestart            : 'Your token has expired. Please click <a class="pjaxload" href="[_1]">here</a> to restart the verification process.',
            textDuplicatedEmail               : 'Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.',
            textErrorBirthdate                : 'Please input a valid date',
            textSelect                        : 'Please select',
            textUnavailableReal               : 'Sorry, account opening is unavailable.',
            textMessageMinRequired            : 'Minimum of [_1] characters required.',
            textFeatureUnavailable            : 'Sorry, this feature is not available.',
            textMessagePasswordScore          : 'Password score is: [_1]. Passing score is: 20.',
            textShouldNotLessThan             : 'Please enter a number greater or equal to [_1].',
            textNumberLimit                   : 'Please enter a number between [_1].', // [_1] should be a range
            featureNotRelevantToVirtual       : 'This feature is not relevant to virtual-money accounts.',
        };

        Object.keys(localized).forEach(function(key) {
            localized[key] = localize(localized[key]);
        });

        const starTime = document.getElementById('start_time_label');
        if (selectorExists(starTime)) {
            starTime.textContent = localized.textStartTime;
        }

        const minDurationTooltip = document.getElementById('duration_tooltip');
        if (selectorExists(minDurationTooltip)) {
            minDurationTooltip.textContent = localized.textMinDuration;
            minDurationTooltip.setAttribute('data-balloon', localized.textMinDurationTooltip);
        }

        const spotLabel = document.getElementById('spot_label');
        if (selectorExists(spotLabel)) {
            spotLabel.textContent = localized.textSpot;
        }

        const barrierTooltip = document.getElementById('barrier_tooltip');
        if (selectorExists(barrierTooltip)) {
            barrierTooltip.textContent = localized.textBarrierOffset;
            barrierTooltip.setAttribute('data-balloon', localized.textBarrierOffsetTooltip);
        }

        const barrierSpan = document.getElementById('barrier_span');
        if (selectorExists(barrierSpan)) {
            barrierSpan.textContent = localized.textBarrier;
        }

        const barrierHighTooltip = document.getElementById('barrier_high_tooltip');
        if (selectorExists(barrierHighTooltip)) {
            barrierHighTooltip.textContent = localized.textHighBarrierOffset;
            barrierHighTooltip.setAttribute('data-balloon', localized.textBarrierOffsetTooltip);
        }
        const barrierHighSpan = document.getElementById('barrier_high_span');
        if (selectorExists(barrierHighSpan)) {
            barrierHighSpan.textContent = localized.textHighBarrier;
        }

        const barrierLowTooltip = document.getElementById('barrier_low_tooltip');
        if (selectorExists(barrierLowTooltip)) {
            barrierLowTooltip.textContent = localized.textLowBarrierOffset;
            barrierLowTooltip.setAttribute('data-balloon', localized.textBarrierOffsetTooltip);
        }
        const barrierLowSpan = document.getElementById('barrier_low_span');
        if (selectorExists(barrierLowSpan)) {
            barrierLowSpan.textContent = localized.textLowBarrier;
        }

        const predictionLabel = document.getElementById('prediction_label');
        if (selectorExists(predictionLabel)) {
            predictionLabel.textContent = localized.textPredictionLabel;
        }

        const payoutOption = document.getElementById('payout_option');
        if (selectorExists(payoutOption)) {
            payoutOption.textContent = localized.textPayout;
        }

        const stakeOption = document.getElementById('stake_option');
        if (selectorExists(stakeOption)) {
            stakeOption.textContent = localized.textStake;
        }

        const purchaseButtonTop = document.getElementById('purchase_button_top');
        if (selectorExists(purchaseButtonTop)) {
            purchaseButtonTop.textContent = localized.textPurchase;
        }

        const purchaseButtonBottom = document.getElementById('purchase_button_bottom');
        if (selectorExists(purchaseButtonBottom)) {
            purchaseButtonBottom.textContent = localized.textPurchase;
        }

        const period_label = document.getElementById('period_label');
        if (selectorExists(period_label)) {
            period_label.textContent = localized.textContractPeriod;
        }

        const amount_per_point_label = document.getElementById('amount_per_point_label');
        if (selectorExists(amount_per_point_label)) {
            amount_per_point_label.textContent = localized.textAmountPerPoint;
        }

        const stop_loss_label = document.getElementById('stop_loss_label');
        if (selectorExists(stop_loss_label)) {
            stop_loss_label.textContent = localized.textStopLoss;
        }

        const stop_profit_label = document.getElementById('stop_profit_label');
        if (selectorExists(stop_profit_label)) {
            stop_profit_label.textContent = localized.textStopProfit;
        }

        const stop_type_label = document.getElementById('stop_type_label');
        if (selectorExists(stop_type_label)) {
            stop_type_label.textContent = localized.textStopType;
        }

        const stop_type_points = document.getElementById('stop_type_points_label');
        if (selectorExists(stop_type_points)) {
            stop_type_points.textContent = localized.textStopTypePoints;
        }

        const indicative_barrier_tooltip = document.getElementById('indicative_barrier_tooltip');
        if (selectorExists(indicative_barrier_tooltip)) {
            indicative_barrier_tooltip.setAttribute('data-balloon', localized.textIndicativeBarrierTooltip);
        }

        const indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip');
        if (selectorExists(indicative_high_barrier_tooltip)) {
            indicative_high_barrier_tooltip.setAttribute('data-balloon', localized.textIndicativeBarrierTooltip);
        }

        const indicative_low_barrier_tooltip = document.getElementById('indicative_low_barrier_tooltip');
        if (selectorExists(indicative_low_barrier_tooltip)) {
            indicative_low_barrier_tooltip.setAttribute('data-balloon', localized.textIndicativeBarrierTooltip);
        }
    };

    const errorMessage = function(messageType, param) {
        let msg = '';
        const separator = ', ';
        switch (messageType) {
            case 'req':
                msg = localized.textMessageRequired;
                break;
            case 'reg':
                if (param) {
                    msg = template(localized.textMessageJustAllowed, [param.join(separator)]);
                }
                break;
            case 'range':
                if (param) {
                    msg = template(localized.textMessageCountLimit, [param]);
                }
                break;
            case 'valid':
                if (param) {
                    msg = template(localized.textMessageValid, [param]);
                }
                break;
            case 'min':
                if (param) {
                    msg = template(localized.textMessageMinRequired, [param]);
                }
                break;
            case 'pass':
                if (param) {
                    msg = template(localized.textMessagePasswordScore, [param]);
                }
                break;
            case 'number_not_less_than':
                msg = template(localized.textShouldNotLessThan, [param]);
                break;
            case 'number_should_between':
                msg = template(localized.textNumberLimit, [param]);
                break;
            default:
                break;
        }
        return msg;
    };

    return {
        localize    : function() { return localized; },
        populate    : populate,
        errorMessage: errorMessage,
    };
})();

module.exports = {
    Content: Content,
};
