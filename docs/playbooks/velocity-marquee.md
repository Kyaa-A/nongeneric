# Velocity Marquee Playbook

Building a seamless, performant marquee that responds dynamically to user scroll velocity and maintains accessibility.

## Why CSS `@keyframes` Marquees Jump on Resize
A common approach to building marquees is using CSS `@keyframes` to translate elements from `100%` to `-100%`. However, this relies on absolute or percentage-based translation distances that don't gracefully handle window resizing. When the container width changes, the percentage value computed by the browser shifts abruptly, causing a noticeable jump or skip in the marquee's motion. Additionally, pure CSS solutions often struggle to synchronize multiple items seamlessly without complex math.

## Seamless `xPercent` Loops with GSAP
GSAP provides a robust way to create infinite, seamless loops using the `xPercent` property. By setting `xPercent: i => i * 100`, we can perfectly align items side-by-side. Then, we animate them by a full `-100%` width. The magic happens with `gsap.utils.wrap(-100, (items.length - 1) * 100)` (or adjusting based on tracking logic) combined with the `modifiers` plugin. As an item moves past the left boundary, it instantly wraps around to the right edge, creating a flawless loop that inherently respects element dimensions and resizing.

## Clamping Scroll Velocity Skews
To make the marquee feel responsive and physical, we can skew the text based on how fast the user is scrolling. We achieve this using `ScrollTrigger.getVelocity()`.

However, unconstrained velocity values can result in extreme skew angles during fast scrolls, which not only looks broken but can trigger motion sickness in some users. To prevent this, we enforce strict limits using `gsap.utils.clamp(-12, 12)`. This ensures the skew never exceeds 12 degrees in either direction, maintaining the aesthetic while protecting the user experience.

## Pausing on Keyboard Focus / Hover for Accessibility
A continuously moving marquee can be highly distracting and makes it difficult for users (especially those using screen readers or keyboard navigation) to read or interact with the content.

We implement event listeners for `mouseenter`/`mouseleave` and `focusin`/`focusout` to pause the GSAP timeline. This ensures that when a user hovers over the marquee or tabs into its content, the motion stops, allowing them to engage with the material at their own pace.
