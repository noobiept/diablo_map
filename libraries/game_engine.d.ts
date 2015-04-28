/// <reference path="../../source/utilities/utilities.1.7.0.d.ts" />
/// <reference path="../../source/typings/tsd.d.ts" />
declare module Game {
    interface EventDispatcherArgs {
    }
    /**
     * Base class that provides a way to add/remove listeners, and dispatch events.
     */
    class EventDispatcher {
        _listeners: any;
        constructor(args?: EventDispatcherArgs);
        /**
         * 'listener' will receive a 'data' argument when its called.
         * What 'data' is, depends on the event type.
         *
         * @param type Type of the event.
         * @param listener A function to be called when the event is dispatched.
         * @return If it was successfully added.
         */
        addEventListener(type: string, listener: (data: any) => any): boolean;
        /**
         * Removes a specific listener of an event type, or all the listeners for that type (if 'listener' is not provided).
         *
         * @param type The event type.
         * @param listener The listener function to remove. If not provided then remove all the functions associated with the event type.
         * @return If it was successfully removed.
         */
        removeEventListener(type: string, listener?: (data: any) => any): boolean;
        /**
         * Remove all the event listeners.
         */
        removeAllEventListeners(): void;
        /**
         * Dispatches an event, which will trigger the listeners of that event.
         *
         * @param type Type of the event to dispatch.
         * @param data Data to be sent to every listener.
         */
        dispatchEvent(type: string, data?: any): void;
        /**
         * Check if there are listeners to a particular event type.
         *
         * @param type The event type to check.
         * @return If there are listeners or not.
         */
        hasListeners(type: string): boolean;
    }
}
declare module Game {
    interface ElementArgs extends EventDispatcherArgs {
        x?: number;
        y?: number;
    }
    /**
     * Base class for a canvas element. Don't create an object directly.
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * @abstract
     */
    class Element extends EventDispatcher {
        x: number;
        y: number;
        width: number;
        height: number;
        opacity: number;
        visible: boolean;
        scaleX: number;
        scaleY: number;
        column: number;
        line: number;
        _rotation: number;
        _container: Container;
        _has_logic: boolean;
        _removed: boolean;
        constructor(args?: ElementArgs);
        /**
         * Draws just this element.
         *
         * @param ctx Canvas context.
         * @abstract
         */
        drawElement(ctx: CanvasRenderingContext2D): void;
        /**
         * Draws this element, and all of its _children.
         *
         * @param ctx Canvas context.
         */
        draw(ctx: CanvasRenderingContext2D): void;
        /**
         * Logic code here (runs every tick).
         *
         * @param deltaTime Time elapsed since the last update.
         */
        logic(deltaTime: any): void;
        /**
         * Check if the element is within the given x/y position.
         */
        intersect(refX: number, refY: number): any[];
        mouseClickEvents(x: any, y: any, event: any): boolean;
        dispatchMouseOverEvent(): void;
        dispatchMouseOutEvent(): void;
        dispatchMouseMoveEvent(): void;
        /**
         * @param event Either a mouse up, mouse down or click event.
         */
        dispatchMouseClickEvent(event: MouseEvent): void;
        /**
         * @returns Rotation in radians.
         */
        /**
         * @param angle Rotate by a certain angle (in radians).
         */
        rotation: number;
        /**
         * @param angle Angle of rotation.
         * @param degrees Whether the angle provided is in degrees or radians.
         */
        rotate(angle: number, degrees?: boolean): void;
        /**
         * Remove this element from the either its container or from the canvas.
         */
        remove(): void;
        /**
         * Create a clone of this element.
         *
         * @abstract
         */
        clone(): Element;
    }
}
declare module Game {
    interface BitmapArgs extends ElementArgs {
        image: HTMLImageElement;
    }
    /**
     * Basic Usage:
     *
     *     var bitmap = new Game.Bitmap({
     *             x: 10,
     *             y: 20,
     *             image: Game.Preload.get( 'id' )
     *         });
     *     Game.addElement( image );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `clone`, `minesweeper`, `multiple_canvas`, `preload`
     */
    class Bitmap extends Element {
        _image: HTMLImageElement;
        _source_x: number;
        _source_y: number;
        _half_width: number;
        _half_height: number;
        constructor(args: BitmapArgs);
        drawElement(ctx: any): void;
        clone(): Bitmap;
        image: HTMLImageElement;
    }
}
declare module Game {
    interface ContainerArgs extends ElementArgs {
        children?: any;
    }
    /**
     * Basic Usage:
     *
     *     var container = new Game.Container();
     *
     *     var rectangle = new Game.Rectangle({
     *             width: 10,
     *             height: 10,
     *             color: 'red'
     *         });
     *     container.addChild( rectangle );
     *
     *     Game.addElement( container );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `basic_example`, `clone`, `minesweeper`
     */
    class Container extends Element {
        _children: Element[];
        constructor(args?: ContainerArgs);
        /**
         *     addChild( element );
         *     addChild( element1, element2 );
         *     addChild( [ element1, element2 ] );
         *
         * @param elements Either `Element` or `...Element` or `Element[]`.
         */
        addChild(elements: any): void;
        /**
         *     removeChild( element );
         *     removeChild( element1, element2 );
         *     removeChild( [ element1, element2 ] );
         *
         * @param args Either `Element` or `...Element` or `Element[]`.
         */
        removeChild(args: any): void;
        /**
         * Remove all of this container's children.
         */
        removeAllChildren(): void;
        /**
         * Draw all the elements in the container.
         *
         * @param ctx The canvas rendering context.
         */
        draw(ctx: CanvasRenderingContext2D): void;
        /**
         * Normally draws the element, but in the case of the container just draw its children.
         *
         * @param ctx The canvas rendering context.
         */
        drawElement(ctx: CanvasRenderingContext2D): void;
        /**
         * Check if the given x/y position intersects with any of this container's children. Returns all the elements it intersects.
         */
        intersect(x: number, y: number): any[];
        mouseClickEvents(x: any, y: any, event: any): boolean;
        /**
         * Calculate the width/height of the container (based on the dimensions of the children elements).
         */
        calculateDimensions(): void;
        /**
         * Call the logic of the children elements.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        logic(deltaTime: number): void;
        /**
         * Clones the container (as well as the children).
         *
         * @return A new cloned container.
         */
        clone(): Container;
    }
}
declare module Game {
    interface BulletArgs extends ContainerArgs {
        movement_speed: number;
        angleOrTarget: any;
        remove?: () => any;
    }
    /**
     * Basic Usage:
     *
     *     var bulletShape = new Game.Rectangle({
     *             width: 10,
     *             height: 2,
     *             color: 'blue'
     *         });
     *     var bullet = new Game.Bullet({
     *             x: 10,
     *             y: 10,
     *             angleOrTarget: 0,
     *             movement_speed: 100,
     *             remove: function()
     *                 {
     *                 console.log( 'Bullet removed!' );
     *                 }
     *         });
     *     bullet.addChild( bulletShape );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     */
    class Bullet extends Container {
        movement_speed: number;
        _move_x: number;
        _move_y: number;
        _target: Element;
        _remove: () => any;
        static _all: Bullet[];
        static _container: Game.Container;
        /**
         * Initializer for the Bullet class.
         */
        static init(): void;
        constructor(args: BulletArgs);
        /**
         * Remove the bullet from the canvas.
         */
        remove(): void;
        /**
         * Logic for when the bullet is moving in a fixed direction.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        fixedLogic(deltaTime: number): void;
        /**
         * Logic for when the bullet is following a target.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        targetLogic(deltaTime: number): void;
        /**
         * This is going to assigned to either .fixedLogic() or .targetLogic(), depending on the type of bullet.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        logic(deltaTime: number): void;
        /**
         * Create a clone of this element.
         */
        clone(): Bullet;
    }
}
declare module Game {
    interface CanvasArgs {
        width: number;
        height: number;
    }
    /**
     * When you call `Game.init()`, a canvas is already added, which you can use to add elements. If you need more than one canvas, then you can create a new canvas object and add to the game.
     *
     * Basic Usage:
     *
     *     var canvas1 = Game.getCanvas();
     *     var canvas2 = new Game.Canvas({
     *             width: 400,
     *             height: 400
     *         });
     *     Game.addCanvas( canvas2 );
     *
     *     var container = new Game.Container();
     *
     *     canvas2.addElement( container );
     *
     * Examples -- `multiple_canvas`
     */
    class Canvas {
        _canvas: HTMLCanvasElement;
        _ctx: CanvasRenderingContext2D;
        _width: number;
        _height: number;
        _elements: Element[];
        events_enabled: boolean;
        update_on_loop: boolean;
        constructor(args: CanvasArgs);
        /**
         *     addElement( element );
         *     addElement( element1, element2 );
         *     addElement( [ element1, element2 ] );
         *
         * @param args Either an `Element`, or `...Element` or an `Element[]`
         */
        addElement(args: any): void;
        /**
         *     removeElement( element );
         *     removeElement( element1, element2 );
         *     removeElement( [ element1, element2 ] );
         *
         * @param args Either an `Element` or `...Element` or an `Element[]`
         */
        removeElement(args: any): boolean;
        /**
         * Get all the elements that are in a given x/y position.
         */
        getElements(x: number, y: number): any[];
        /**
         * Call the logic of the elements added to this canvas (normally on the game loop).
         *
         * @param deltaTime Time elapsed since the last update.
         */
        logic(deltaTime: number): void;
        /**
         * Draw all the elements added to the canvas.
         */
        draw(): void;
        /**
         * Receives a mouse event. Move it along to this canvas elements, to see if there's an element that has listeners to it.
         *
         * @param event The mouse event triggered.
         */
        mouseClickEvents(event: MouseEvent): void;
        /**
         * Change the canvas dimensions (width/height).
         *
         * @param width The new width.
         * @param height The new Height.
         */
        updateDimensions(width: number, height: number): void;
        /**
         * Get a random x/y position that is within the canvas.
         *
         * @return The random x/y position.
         */
        getRandomPosition(): {
            x: number;
            y: number;
        };
        /**
         * @param x The x position.
         * @param y The y position.
         * @return If this position is located inside the canvas or not.
         */
        isInCanvas(x: number, y: number): boolean;
        /**
         * @return The canvas width.
         */
        getWidth(): number;
        /**
         * @return The canvas height.
         */
        getHeight(): number;
        /**
         * @return The canvas html element.
         */
        getHtmlCanvasElement(): HTMLCanvasElement;
        /**
         * @return The 2d canvas rendering context object.
         */
        getCanvasContext(): CanvasRenderingContext2D;
        /**
         * @return The elements added to this canvas.
         */
        getAllElements(): Element[];
    }
}
declare module Game {
    interface CircleArgs extends ElementArgs {
        radius: number;
        color: string;
    }
    /**
     * Basic Usage:
     *
     *     var circle = new Game.Circle({
     *             x: 10,
     *             y: 10,
     *             radius: 5,
     *             color: 'blue'
     *         });
     *     Game.addElement( circle );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `basic_example`, `clone`, `custom_element`
     */
    class Circle extends Element {
        color: string;
        private _radius;
        constructor(args: CircleArgs);
        radius: number;
        drawElement(ctx: CanvasRenderingContext2D): void;
        clone(): Circle;
    }
}
declare module Game {
    /**
     * Basic Usage:
     *
     *     var menu = new Game.Html.HtmlContainer();
     *
     *     var button = new Game.Html.Button({
     *             value: 'click here',
     *             callback: function( button )
     *                 {
     *                 console.log( 'clicked!' );
     *                 }
     *         });
     *     menu.addChild( button );
     *
     *     document.body.appendChild( menu.container );
     *
     * Examples -- `game_menu`, `game_of_life`, `message`, `minesweeper`
     */
    module Html {
        interface HtmlElementArgs {
            cssId?: string;
            cssClass?: any;
            preText?: string;
        }
        /**
         * Generic html element, serves as base for the rest of the classes.
         */
        class HtmlElement {
            container: HTMLElement;
            _is_active: boolean;
            _pre_text: HTMLElement;
            constructor(args?: HtmlElementArgs);
            /**
             * When the element is inactive, its events are disabled, and a `.Game-inactive` css class is applied.
             *
             * @param yesNo Whether to set it active or not.
             */
            setActive(yesNo: boolean): void;
            /**
             * Check if the element is active or not currently.
             */
            isActive(): boolean;
            /**
             * Activates the element's event handlers.
             */
            addEvents(): void;
            /**
             * Deactivate the element's event handlers.
             */
            removeEvents(): void;
            /**
             * Calls this to remove the element.
             */
            clear(): void;
        }
        interface HtmlContainerArgs extends HtmlElementArgs {
            children?: any;
        }
        /**
         * Container of the other html elements.
         */
        class HtmlContainer extends HtmlElement {
            _children: HtmlElement[];
            constructor(args?: HtmlContainerArgs);
            /**
             *     addChild( element );
             *     addChild( element1, element2 );
             *     addChild( [ element1, element2 ] );
             *
             * @param args `HtmlElement` or `...HtmlElement` or `HtmlElement[]`.
             */
            addChild(args: any): void;
            /**
             *     removeChild( element );
             *     removeChild( element1, element2 );
             *     removeChild( [ element1, element2 ] );
             *
             * @param args `HtmlElement` or `...HtmlElement` or `HtmlElement[]`.
             */
            removeChild(args: any): void;
            /**
             * Remove all children of this container.
             */
            removeAllChildren(): void;
            /**
             * Removes the container, plus all of its children (can't use the container after this).
             */
            clear(): void;
        }
        interface ValueArgs extends HtmlElementArgs {
            value: any;
        }
        /**
         * Display a value.
         */
        class Value extends HtmlElement {
            value: any;
            element: HTMLElement;
            constructor(args: ValueArgs);
            /**
             * @param value New value to be displayed.
             */
            setValue(value: any): void;
            /**
             * @return The current value set.
             */
            getValue(): any;
            /**
             * Clear the object (don't use it after this).
             */
            clear(): void;
        }
        interface ButtonArgs extends ValueArgs {
            callback?: (button: Button) => any;
        }
        /**
         * An html button.
         */
        class Button extends Value {
            click_ref: () => any;
            constructor(args: ButtonArgs);
            /**
             * Add the click event handler.
             */
            addEvents(): void;
            /**
             * Remove the click event handler.
             */
            removeEvents(): void;
            /**
             * Clear the object (don't use it after this).
             */
            clear(): void;
        }
        interface BooleanArgs extends ButtonArgs {
            value: boolean;
        }
        /**
         * A boolean html button (possible values are 'On' or 'Off').
         */
        class Boolean extends Button {
            value: boolean;
            constructor(args: BooleanArgs);
            /**
             * @param value New value of the button. When the value is `true`, the display text is 'On`, and when the value is `false`, the display text will be `Off`.
             */
            setValue(value: boolean): void;
            /**
             * @return The current value that is set.
             */
            getValue(): boolean;
        }
        interface TwoStateArgs extends ButtonArgs {
            value2: string;
            callback2?: (button: TwoState) => any;
        }
        /**
         * A button that has 2 states, each state with its own value and callback.
         */
        class TwoState extends Button {
            isValue1: boolean;
            constructor(args: TwoStateArgs);
            getValue(): string;
        }
        interface MultipleOptionsArgs extends HtmlElementArgs {
            options: string[];
            callback?: (button: MultipleOptions, position: number, htmlElement: HTMLElement) => any;
        }
        /**
         * Multiple options button.
         */
        class MultipleOptions extends HtmlElement {
            elements: HTMLElement[];
            click_ref: () => any;
            selected: HTMLElement;
            constructor(args: MultipleOptionsArgs);
            /**
             * Select the active option by position.
             *
             * @param position The position to select.
             */
            select(position: number): void;
            /**
             * Get the string value of the currently selected option.
             */
            getValue(): string;
            /**
             * add the click event handler on the options.
             */
            addEvents(): void;
            /**
             * Remove the click event handlers from the options elements.
             */
            removeEvents(): void;
            /**
             * Clear the object.
             */
            clear(): void;
        }
        interface RangeArgs extends HtmlElementArgs {
            min: number;
            max: number;
            value: number;
            step?: number;
            onChange?: (button: Range) => any;
        }
        /**
         * Number range control.
         */
        class Range extends HtmlElement {
            value: HTMLElement;
            input: HTMLInputElement;
            current_value: number;
            change_ref: (event) => any;
            input_ref: (event) => any;
            number_of_decimals: number;
            constructor(args: RangeArgs);
            /**
             * @param value New value to be set.
             */
            setValue(value: number): void;
            /**
             * @return Current value that is set.
             */
            getValue(): number;
            /**
             * Add the relevant event handlers.
             */
            addEvents(): void;
            /**
             * Remove the event handlers.
             */
            removeEvents(): void;
            /**
             * Clear the object.
             */
            clear(): void;
        }
        interface TextArgs extends HtmlElementArgs {
            placeholder?: string;
            callback?: (button: Text) => any;
            buttonText?: string;
        }
        /**
         * Text input control.
         */
        class Text extends HtmlElement {
            input: HTMLInputElement;
            button: Button;
            key_ref: (event) => any;
            constructor(args?: TextArgs);
            setValue(value: string): void;
            getValue(): string;
            addEvents(): void;
            removeEvents(): void;
            clear(): void;
        }
    }
}
declare module Game {
    /**
     * Basic Usage:
     *
     *     Game.HighScore.init( 5, 'game_name_high_score', true );
     *
     *     var score = 10;
     *     Game.HighScore.add( 'easy', score );
     *
     *     var easyScores = Game.HighScore.get( 'easy' );
     *
     *     for (var a = 0 ; a < easyScores.length ; a++)
     *         {
     *         console.log( easyScores[ a ] );
     *         }
     *
     * Examples -- `minesweeper`
     */
    module HighScore {
        /**
         * Call this before adding scores.
         *
         * @param maxScoresSaved Total number of scores saved (only the top scores).
         * @param storageName Name to be used when loading/saving to localStorage.
         * @param ascending Sort the values in ascending or descending order.
         */
        function init(maxScoresSaved: number, storageName: string, ascending: boolean): void;
        /**
         * Add a score. For example `Game.HighScore.add( 'easy', 5 );`.
         *
         * @param key The key of the score.
         * @param value The score value.
         */
        function add(key: string, value: number): void;
        /**
         * @param key The score key.
         * @return An array with all the scores associated with the provided key.
         */
        function get(key: string): any;
        /**
         * Remove all the scores (clears the `localStorage` as well).
         */
        function clear(): void;
    }
}
declare module Game {
    interface MessageArgs extends Game.Html.HtmlContainerArgs {
        body: any;
        container: HTMLElement;
        buttons?: any;
        timeout?: number;
        background?: boolean;
    }
    /**
     * Basic Usage:
     *
     *     var container = Game.getCanvasContainer();
     *
     *     var button = new Game.Html.Button({
     *             value: 'Ok',
     *             callback: function( button )
     *                 {
     *                 message.clear();
     *                 }
     *         });
     *     var message = new Game.Message({
     *             body: 'Hi there!',
     *             container: container,
     *             background: true,
     *             buttons: button
     *         });
     *
     * Examples -- `message`, `minesweeper`
     */
    class Message extends Game.Html.HtmlContainer {
        body: Html.HtmlContainer;
        buttons: Html.HtmlContainer;
        background: HTMLElement;
        timeout: Utilities.Timeout;
        constructor(args: MessageArgs);
        /**
         * Remove the message.
         */
        clear(): void;
        /**
         * @param body Set the body of the message. Either a `string`, `HTMLElement`, `Html.HtmlElement` or an `array` with any combination of the types above.
         */
        setBody(body: any): void;
    }
}
declare module Game {
    enum TweenAction {
        properties = 0,
        wait = 1,
        call = 2,
    }
    interface TweenStep {
        action: TweenAction;
        duration?: number;
        end_properties?: Object;
        ease?: (value: number) => number;
        callback?: () => any;
    }
    /**
     * Basic Usage:
     *
     *     var rectangle = new Game.Rectangle({
     *             x: 10,
     *             y: 10,
     *             width: 10,
     *             height: 10,
     *             color: 'green'
     *         });
     *     Game.addElement( rectangle );
     *
     *     var tween = new Game.Tween( rectangle );
     *
     *     tween.to( { x: 200 }, 2 ).wait( 1 ).call function()
     *         {
     *         console.log( 'Finished!' );
     *         }).start();
     *
     * Examples -- `2048`, `basic_example`, `clone`, `multiple_canvas`, `tween`
     */
    class Tween {
        static _tweens: Tween[];
        _element: Object;
        _steps: TweenStep[];
        _current_step: TweenStep;
        _start_properties: Object;
        _count: number;
        _update: (delta: number) => any;
        constructor(element: Object);
        /**
         * Start the tween animation.
         */
        start(): void;
        /**
         * Set the end value of some properties, and the animation duration.
         *
         * @param properties The `key` is the element's properties we want to animate, and the `value` is the value that property will have at the end of the animation.
         * @param duration Duration of the animation.
         * @param ease Ease function, that describes how the value of the property will progress between the animation.
         * @return The tween object for chaining.
         */
        to(properties: Object, duration: number, ease?: (value: number) => number): Tween;
        /**
         * Wait for some time doing nothing.
         *
         * @param duration Duration of the wait.
         * @return The tween object for chaining.
         */
        wait(duration: number): Tween;
        /**
         * Call a given function.
         *
         * @param callback The function to be called.
         * @return The tween object for chaining.
         */
        call(callback: () => any): Tween;
        /**
         * Remove the tween.
         */
        remove(): void;
        /**
         * Move unto the next step in the tween animation.
         */
        nextStep(): void;
        /**
         * .wait() tick logic.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        waitUpdate(deltaTime: number): void;
        /**
         * .to() tick logic.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        propertiesUpdate(deltaTime: any): void;
        /**
         * Returns an existing tween of an element, or null if there's no active tween working on the element.
         *
         * @param element The element that has a tween animation.
         * @return The associated tween object.
         */
        static getTween(element: Object): Tween;
        /**
         * Remove all the tweens of an element.
         *
         * @param element The element associated with the tweens we want to remove.
         */
        static removeTweens(element: Object): void;
        /**
         * Remove all the tween animations.
         */
        static removeAll(): void;
        /**
         * Gets called in the game loop, to update all the tween animations.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        static update(deltaTime: number): void;
    }
    module Tween {
        /**
         * Ease function, that describes how the value of the property will progress between the animation.
         */
        module Ease {
            function linear(value: number): number;
            function quadraticIn(value: number): number;
        }
    }
}
declare module Game {
    interface GridArgs extends EventDispatcherArgs {
        squareSize: number;
        columns: number;
        lines: number;
        refX?: number;
        refY?: number;
        background?: {
            color: string;
            fill: boolean;
            canvasId?: number;
        };
    }
    /**
     * Basic Usage:
     *
     *     var rectangle = new Game.Rectangle({
     *             width: 10,
     *             height: 10,
     *             color: 'green'
     *         });
     *     Game.addElement( rectangle );
     *
     *     var grid = new Game.Grid({
     *             squareSize: 10,
     *             columns: 20,
     *             lines: 20
     *         });
     *     grid.addElement( rectangle, 10, 10 );
     *
     * Events:
     *
     * - `collision` -- `listener( data: { element: Element; collidedWith: Element; } );`
     *
     * Examples -- `2048`, `game_of_life`, `grid`, `minesweeper`, `snake`
     */
    class Grid extends EventDispatcher {
        _grid: Element[][];
        columns: number;
        lines: number;
        square_size: number;
        ref_x: number;
        ref_y: number;
        _background: Rectangle;
        constructor(args: GridArgs);
        /**
         * Get the equivalent x/y position from a column/line position.
         *
         * @param column The column position.
         * @param line The line position.
         * @return The x/y position.
         */
        toCanvas(column: number, line: number): {
            x: number;
            y: number;
        };
        /**
         * Get the equivalent column/line position from a x/y position.
         *
         * @param x The x position.
         * @param y The y position.
         * @return The column/line position.
         */
        toGrid(x: number, y: number): {
            column: number;
            line: number;
        };
        /**
         * Add an `Element` to a grid position.
         *
         * @param element The element to be added.
         * @param column The column position.
         * @param line The line position.
         * @return The previous element that was in that position (or `null` if there wasn't one).
         */
        addElement(element: Element, column: number, line: number): Element;
        /**
         * Move an element from one grid position to another (the element needs to be already in the grid).
         *
         * @param element The element to be moved.
         * @param destColumn The destination column position.
         * @param destLine The destination line position.
         * @param duration If duration >0, then a tween animation is going to be applied to the movement.
         * @return The previous element that was in the destination position (or null if there wasn't one).
         */
        moveElement(element: Element, destColumn: number, destLine: number, duration?: number): Element;
        /**
         * Move an element from one grid position to another (the element needs to be already in the grid).
         *
         * @param sourceColumn The source column of an existing element.
         * @param sourceLine The source line of an existing element.
         * @param destColumn The destination column position.
         * @param destLine The destination line position.
         * @param duration If duration >0, then a tween animation is going to be applied to the movement.
         * @return The previous element that was in the destination position (or null if there wasn't one).
         */
        movePosition(sourceColumn: number, sourceLine: number, destColumn: number, destLine: number, duration?: number): Element;
        /**
         * Remove an element from the grid.
         *
         * @param element The element to be removed.
         * @return The element that was removed.
         */
        removeElement(element: any): Element;
        /**
         * Remove an element from the grid.
         *
         * @param column The column position.
         * @param line The line position.
         * @return The element that was removed.
         */
        removePosition(column: number, line: number): Element;
        /**
         * Get an element from the grid.
         *
         * @param column The column position.
         * @param line The line position.
         * @return The element, or `null` if there wasn't an element in that position.
         */
        getElement(column: number, line: number): Element;
        /**
         * Get an element from the grid.
         *
         * @param x The x position.
         * @param y The y position.
         * @return The element, or `null` if there wasn't an element in that position.
         */
        getElement2(x: number, y: number): Element;
        /**
         * @param column The column position.
         * @param line The line position.
         * @return If the position is empty or not.
         */
        isEmpty(column: number, line: number): boolean;
        /**
         * Makes sure the position is within the grid's dimensions.
         * For example if you pass a column that is <0 then it will return a column with value 0 (since you can't have negative columns).
         *
         * @param column The column position.
         * @param line The line position.
         * @return The column/line position that is guaranteed to be within the grid's dimensions.
         */
        normalizePosition(column: number, line: number): {
            column: number;
            line: number;
        };
        /**
         * @param column The column position.
         * @param line The line position.
         * @return If this position is valid for this grid (is within it).
         */
        isInGrid(column: number, line: number): boolean;
        /**
         * @return A random column/line position that is within the grid's dimensions.
         */
        getRandomPosition(): {
            column: number;
            line: number;
        };
        /**
         * @return A random empty column/line position, or `null` if there aren't any empty positions.
         */
        getRandomEmptyPosition(): any;
        /**
         * @return An array with all the empty column/line positions of this grid (the array will be empty if there aren't any empty positions).
         */
        getEmptyPositions(): any[];
        /**
         * @return The grid's dimensions.
         */
        getDimensions(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        /**
         * Clear grid related elements etc.
         * Called when we don't need the grid anymore.
         */
        clear(): void;
        /**
         * Get the neighbor elements around the given position.
         *
         * @param refColumn The reference column position.
         * @param refLine The reference line position.
         * @param range The range of elements around the reference position to get.
         * @return The neighbor elements.
         */
        getNeighbors(refColumn: number, refLine: number, range?: number): any[];
    }
}
declare module Game {
    interface SpriteArgs extends BitmapArgs {
        frameWidth: number;
        frameHeight: number;
        animations?: {
            [id: string]: number[];
        };
        interval?: number;
    }
    /**
     * Basic usage:
     *
     *     var sprite = new Game.Sprite({
     *             x: 10,
     *             y: 20,
     *             image: Game.Preload.get( 'id' ),
     *             frameWidth: 30,
     *             frameHeight: 40,
     *             interval: 1,
     *             animations: {
     *                 animationName: [ 0, 1 ]
     *             }
     *         });
     *     Game.addElement( sprite );
     *
     *         // set a static frame
     *     sprite.setFrame( 1 );
     *
     *         // or play a specific animation
     *     sprite.play( 'animationName' );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `clone`, `sprite`
     */
    class Sprite extends Bitmap {
        interval: number;
        _count_interval: number;
        _frames_per_line: number;
        _animations: {
            [id: string]: number[];
        };
        _current_animation: number[];
        _current_animation_position: number;
        constructor(args: SpriteArgs);
        /**
         * Show a specific frame of the sprite.
         *
         * @param frame The position of the frame.
         */
        setFrame(frame: number): void;
        /**
         * Play a previously set animation.
         *
         * @param animationId The name of the animation.
         * @return If it was successful.
         */
        play(animationId: string): boolean;
        /**
         * Change to the next frame. If we're on the last frame then it changes to the first one (frame 0).
         */
        nextFrame(): void;
        /**
         * Changes the current sprite frame, based on the interval set.
         *
         * @param deltaTime Time elapsed since the last update.
         */
        logic(deltaTime: number): void;
        /**
         * @return A cloned sprite object.
         */
        clone(): Sprite;
    }
}
declare module Game {
    interface TextArgs extends ElementArgs {
        text?: string;
        fontFamily?: string;
        fontSize?: number;
        timeout?: number;
        textAlign?: string;
        textBaseline?: string;
        fill?: boolean;
        color?: string;
    }
    /**
     * Basic Usage:
     *
     *     var text = new Game.Text({
     *             x: 10,
     *             y: 20,
     *             text: 'Hi'
     *         });
     *     Game.addElement( text );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `2048`, `clone`, `collision_detection`, `game_loop_callbacks`, `preload`, `snake`
     */
    class Text extends Element {
        textAlign: string;
        textBaseline: string;
        fill: boolean;
        color: string;
        _text: string;
        _font_family: string;
        _font_size: number;
        _font: string;
        _timeout: number;
        _lines: string[];
        constructor(args: TextArgs);
        /**
         * Draw this element.
         *
         * @param ctx The canvas rendering context.
         */
        drawElement(ctx: CanvasRenderingContext2D): void;
        /**
         * @return The current text.
         */
        /**
         * @param value Change the text to this.
         */
        text: string;
        /**
         * @return Current font family.
         */
        /**
         * @param font Set a new font family.
         */
        font_family: string;
        /**
         * @return Current font size.
         */
        /**
         * @param size New font size.
         */
        font_size: number;
        /**
         * @return New cloned text object.
         */
        clone(): Text;
    }
}
declare module Game {
    /**
     * Basic Usage:
     *
     *     var preload = new Game.Preload({ save_global: true });
     *
     *     preload.addEventListener( 'complete', function()
     *         {
     *         Game.Sound.play( Game.Preload.get( 'sound' ) );
     *         });
     *     preload.load( 'sound', 'path_to_file.ogg' );
     *
     * Examples -- `preload`
     */
    module Sound {
        /**
         * Initialize the `Sound` module. Its called in `Game.init()`.
         */
        function init(): void;
        /**
         * Decode audio file data contained in an ArrayBuffer.
         *
         * @param data The audio data.
         * @param callback Function to be called when the data has been decoded.
         */
        function decodeAudio(data: ArrayBuffer, callback: (decodedData: AudioBuffer) => any): void;
        /**
         * Play a sound.
         *
         * @param audioBuffer The audio buffer of the sound we want to play.
         */
        function play(audioBuffer: AudioBuffer): void;
    }
}
interface Window {
    URL: any;
}
declare module Game {
    interface PreloadArgs extends EventDispatcherArgs {
        save_global?: boolean;
    }
    /**
     * Basic Usage:
     *
     *     var preload = new Game.Preload({ save_global: true });
     *
     *     preload.addEventListener( 'complete', completeListener );
     *     preload.load( 'id', 'path_to_file.png' );
     *
     *         // or with a manifest
     *     var manifest = [
     *             { id: 'the_id', path: 'path_to_file.png' }
     *         ];
     *     preload.loadManifest( manifest, '' );
     *
     * Events:
     *
     * - `complete` -- `listener();`
     * - `error` -- `listener( data: { id: string; event; } );`
     * - `abort` -- `listener( data: { id: string; event; } );`
     * - `progress` -- `listener( progress: number );`
     * - `fileload` -- `listener( data: { id: string; data: Object; } );`
     *
     * Examples -- `clone`, `minesweeper`, `multiple_canvas`, `preload`, `sprite`
     */
    class Preload extends EventDispatcher {
        _data: Object;
        save_global: boolean;
        _total_items: number;
        _loaded_items: number;
        constructor(args?: PreloadArgs);
        /**
         * An element just finished being loaded, add it to the `data` object (either the global or the object) and dispatch the relevant events.
         *
         * @param id The id of the loaded element.
         * @param data Its data.
         */
        _loaded(id: string, data: any): void;
        /**
         * Dispatch the `error` event.
         *
         * @param event The event to dispatch.
         * @param id The id of the element.
         */
        _on_error(event: any, id: string): void;
        /**
         * Dispatch the `abort` event.
         *
         * @param event The event to dispatch.
         * @param id The id of the element.
         */
        _on_abort(event: any, id: string): void;
        /**
         * Dispatch the current progress percentage.
         *
         * @param event The event that was triggered.
         */
        _on_progress(event: ProgressEvent): void;
        /**
         * Load a file.
         *
         * @param id The id to be used later on to get the element.
         * @param path Path to the file.
         * @param typeId Type of the file to load. If not provided then it will try to determine the type from the file extension.
         */
        load(id: string, path: string, typeId?: Game.Preload.TYPES): void;
        /**
         * Load several files.
         *
         * @param manifest Has the information about the files.
         * @param basePath Base path for all the files in the manifest.
         */
        loadManifest(manifest: {
            id: string;
            path: string;
        }[], basePath?: string): void;
        /**
         * Get a previously loaded file.
         *
         * @param id The id of the file.
         */
        get(id: string): any;
    }
    module Preload {
        enum TYPES {
            image = 0,
            json = 1,
            text = 2,
            audio = 3,
        }
        var EXTENSIONS: {
            image: string[];
            json: string[];
            text: string[];
            audio: string[];
        };
        var RESPONSE_TYPE: {
            image: string;
            json: string;
            text: string;
            audio: string;
        };
        var DATA: {};
        /**
         * Get an element that was saved in the global `DATA` object.
         *
         * @param id The id of the element we're retrieving.
         * @return The preloaded element.
         */
        function get(id: string): any;
        /**
         * Determine the type of a file based on its extension.
         *
         * @param file The file name.
         * @return The file type.
         */
        function getType(file: string): any;
    }
}
declare module Game {
    interface RectangleArgs extends ElementArgs {
        width: number;
        height: number;
        color: string;
        fill?: boolean;
    }
    /**
     * Basic Usage:
     *
     *     var rectangle = new Game.Rectangle({
     *             x: 100,
     *             y: 200,
     *             width: 10,
     *             height: 20,
     *             color: 'gray'
     *         });
     *     Game.addElement( rectangle );
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     *
     * Examples -- `basic_example`, `bullets`, `clone`, `collision_detection`, `custom_element`, `game_of_life`, `grid`, `mouse_move`, `multiple_canvas`, `preload`, `snake`, `tween`
     */
    class Rectangle extends Element {
        color: string;
        half_width: number;
        half_height: number;
        fill: boolean;
        constructor(args: RectangleArgs);
        /**
         * Draw this element.
         *
         * @param ctx The canvas rendering context.
         */
        drawElement(ctx: CanvasRenderingContext2D): void;
        clone(): Rectangle;
    }
}
/**
 * Basic usage:
 *
 *     Game.init( document.body, 400, 400 );
 *
 *     var rect = new Game.Rectangle({
 *             x: 200,
 *             y: 200,
 *             width: 20,
 *             height: 20,
 *             color: 'green'
 *         });
 *     Game.addElement( rect );
 *
 *     Game.addToGameLoop( function()
 *         {
 *         console.log( 'hi' );
 *         }, 1 );
 *
 */
declare module Game {
    /**
     * Initialize the canvas/game loop/etc.
     *
     * @param htmlContainer The canvas is going to be appended to this element.
     * @param canvasWidth Canvas width.
     * @param canvasHeight Canvas height.
     */
    function init(htmlContainer: HTMLElement, canvasWidth: number, canvasHeight: number): void;
    /**
     * Starts the game loop. This is called automatically when you initialize the engine (Game.init()).
     * Only useful when you manually stop the loop (with Game.stopGameLoop()) and need to restart it later.
     */
    function startGameLoop(): void;
    /**
     * Stops the game loop (that means there's no redrawn of the canvas, callbacks in the game loop being called, tween loop, etc).
     */
    function stopGameLoop(): void;
    /**
     * Activate the mouse move events: `mouseout` and `mouseover`.
     *
     * @param interval Interval (in milliseconds) between calls of the function that checks for these events.
     */
    function activateMouseMoveEvents(interval: number): void;
    /**
     * Disable the mouse move events: `mouseout` and `mouseover`.
     */
    function disableMouseMoveEvents(): void;
    /**
     * Get a canvas object (Game.Canvas). When called without an argument it returns the first one.
     *
     * @param id Id of the canvas, returns the first one (id 0) by default.
     */
    function getCanvas(id?: number): Canvas;
    /**
        @param canvas The canvas to be added.
        @param position The desired position of the canvas. The canvas are stacked on the same space. The 0 position, is the one in the back, and the higher the value, the most on top. Keep in mind that the position may not be the same as the returned id. If not provided, then the canvas is added on top (last position).
        @return The id of the canvas. Can be used to retrieve the canvas later on with Game.getCanvas(). The id can be invalidated if there's new canvas added in a specific position.
     */
    function addCanvas(canvas: Game.Canvas, position?: number): number;
    /**
        Adds an element to a canvas. If 'id' is not given, then its added to the first canvas (the one most to the back).
    
        @param element Element or Element[] to be added.
        @param id The canvas id.
     */
    function addElement(element: any, id?: number): void;
    /**
     * For when you don't know in what canvas the element is in. It will try in all the canvas.
     *
     * @param element Element or Element[] to be removed.
     * @return If the element was removed.
     */
    function removeElement(element: any): boolean;
    /**
     * Adds a callback function to be called at a certain interval (or every tick) in the game loop (before the draw phase)
     *
     * @param callback The callback function.
     * @param interval Interval between function calls. If not given then it is called every tick. In seconds.
     * @return If it was added successful.
     */
    function addToGameLoop(callback: () => any, interval?: number): boolean;
    /**
     * Remove a callback from the game loop.
     *
     * @param callback The function to remove.
     * @return If the function was removed or wasn't found.
     */
    function removeFromGameLoop(callback: () => any): boolean;
    /**
     * Remove all the callbacks from the game loop.
     */
    function removeAllCallbacks(): void;
    /**
     * @return The canvas container (an html element).
     */
    function getCanvasContainer(): HTMLDivElement;
    /**
     * Return the current mouse position (in the client area, not the canvas).
     */
    function getMousePosition(): {
        x: number;
        y: number;
    };
}
declare module Game {
    interface UnitArgs extends ContainerArgs {
        movement_speed?: number;
        bullet_movement_speed?: number;
        health?: number;
        bullet_shape?: {
            classRef: (args: any) => void;
            args: Object;
        };
    }
    enum UnitMovement {
        stop = 0,
        angle = 1,
        destination = 2,
        loop = 3,
    }
    /**
     * Basic Usage:
     *
     *     var unitShape = new Game.Rectangle({
     *             width: 10,
     *             height: 10,
     *             color: 'blue'
     *         });
     *     var unit = new Game.Unit({
     *             x: 100,
     *             y: 100,
     *             movement_speed: 100,
     *             children: unitShape
     *         });
     *     Game.addElement( unit );
     *
     *     unit.moveTo( 300, 100 );
     *     unit.queueMoveTo( 200, 200, function()
     *         {
     *         console.log( 'Done!' );
     *         });
     *
     * Events:
     *
     * - `click` -- `listener( data: { event: MouseEvent; } );`
     * - `mousedown` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseup` -- `listener( data: { event: MouseEvent; } );`
     * - `mousemove` -- `listener( data: { event: MouseEvent; } );`
     * - `mouseover` -- `listener( data: { element: Element; } );`
     * - `mouseout` -- `listener( data: { element: Element; } );`
     * - `collision` -- `listener( data: { element: Unit; collidedWith: Unit; } );`
     *
     * Examples -- `2048`, `basic_example`, `bullets`, `collision_detection`, `custom_element`
     */
    class Unit extends Container {
        static _all: Unit[];
        static collidesWith: Unit[];
        movement_speed: number;
        bullet_movement_speed: number;
        health: number;
        _movement_type: UnitMovement;
        _is_moving: boolean;
        _move_x: number;
        _move_y: number;
        _move_callback: () => any;
        _destination_x: number;
        _destination_y: number;
        _is_destination_x_diff_positive: boolean;
        _is_destination_y_diff_positive: boolean;
        _path: {
            x: number;
            y: number;
            callback?: () => any;
        }[];
        _loop_path_position: number;
        _bullet_interval: number;
        _bullet_interval_count: number;
        _angle_or_target: any;
        _bullets: Bullet[];
        _bullet_shape: {
            classRef: (args: any) => void;
            args: Object;
        };
        constructor(args: UnitArgs);
        /**
         * @param animationDuration If this is passed, then the unit's opacity will be animated until it reaches 0, and only then will the unit be removed
         */
        remove(animationDuration?: number): void;
        /**
         * Remove the unit immediately.
         */
        _removeNow(): void;
        /**
         * Clears any previous path, and forces the unit to move to the specified position.
         */
        moveTo(x: number, y: number, callback?: () => any): void;
        /**
         * Move to the next position in the path.
         */
        moveToNext(): boolean;
        /**
         * Stop moving.
         */
        stop(): void;
        /**
         * Add a x/y position to the movement queue.
         *
         * @param x The x position.
         * @param y The y position.
         * @param callback Optional function to be called when it reaches this position.
         */
        queueMoveTo(x: number, y: number, callback?: () => any): void;
        /**
         * Move continuously between the positions in the path.
         *
         * @param path The path of the movement.
         */
        moveLoop(path: {
            x: number;
            y: number;
            callback?: () => any;
        }[]): void;
        /**
         * Move continuously in a specific angle.
         *
         * @angle The angle of the direction. Positive clockwise.
         * @degrees If the `angle` value is in degrees or radians.
         * @callback To be called when it reaches the end of the canvas.
         */
        moveAngle(angle: number, degrees?: boolean, callback?: () => any): void;
        /**
         * @param angleOrTarget {Number|Element} The angle of the bullet movement. If not given, then the bullet will have the unit's current rotation angle. Can be passed an Element which will work as the target of the bullet (it will follow the target until it hits it).
         * @param interval If you want to keep firing bullets at the same angle (or same target). Pass a positive number for that.
         */
        fireBullet(angleOrTarget?: any, interval?: number): void;
        /**
         * Stop firing bullets (if it was set to fire at a certain interval).
         */
        stopFiring(): void;
        /**
         * Fire a bullet at a certain angle, or towards a specific target.
         *
         * @param angleOrTarget The angle or target of the bullet.
         */
        _fire(angleOrTarget?: any): void;
        /**
         * Its called in every update. This is going to be assigned to a different movement logic method, depending on the current movement type.
         *
         * @param delta Time elapsed since the last update.
         */
        movementLogic(delta: number): void;
        /**
         * Deals with movement in a certain direction/angle.
         * Calls the function callback when it reaches the end of the canvas.
         *
         * @param delta Time elapsed since the last update.
         */
        movementAngleLogic(delta: number): void;
        /**
         * Deals with movement to a x/y position.
         * Calls the function callback when it reaches the destination.
         *
         * @param delta Time elapsed since the last update.
         */
        movementPathLogic(delta: number): void;
        /**
         * You can set the unit to fire bullets at a certain interval. This is the function that deals with that logic.
         *
         * @param delta Time elapsed since the last update.
         */
        firingLogic(delta: number): void;
        /**
         * Logic to determine when a unit has collided with another unit.
         *
         * @param delta Time elapsed since the last update.
         */
        collisionLogic(delta: number): void;
        /**
         * Unit's logic function, that gets called in every update.
         *
         * @param delta Time elapsed since the last update.
         */
        logic(delta: number): void;
        /**
         * @return A clone of this unit.
         */
        clone(): Unit;
    }
}
