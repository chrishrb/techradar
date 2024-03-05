export default class Tooltip {
    private tooltip;
    private tooltipSpan;
    constructor();
    show: (text: string, anchorX: number, anchorY: number) => void;
    hide: () => void;
    destroy: () => void;
}
