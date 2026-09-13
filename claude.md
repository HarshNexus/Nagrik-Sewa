# Project Coding Rules

## Core Principle

Write the simplest correct solution.

Before adding code, determine whether the requirement can be satisfied by:

1. Existing project code
2. Existing framework/platform functionality
3. The standard library
4. Existing dependencies
5. Only then, new code

Do not introduce complexity without a concrete reason.

---

## 1. Understand Before Modifying

Before making changes:

* Inspect the relevant project structure.
* Read the existing implementation.
* Search for related functionality.
* Identify existing patterns and conventions.
* Understand how the affected code is currently used.

Do not make assumptions about how the project works when the codebase can answer the question.

---

## 2. Reuse Existing Code

Always search for existing functionality before creating new:

* functions
* utilities
* hooks
* components
* classes
* services
* helpers
* types
* abstractions

If an existing implementation can reasonably solve the problem, reuse or extend it.

Avoid duplicate implementations.

---

## 3. YAGNI — You Aren't Gonna Need It

Only implement what is currently required.

Do NOT add:

* hypothetical future features
* unnecessary configuration
* unused abstractions
* speculative error handling
* premature optimizations
* unnecessary flexibility
* unused extension points
* features that were not requested

Do not solve imaginary problems.

---

## 4. Prefer Simple Solutions

When multiple solutions are correct, prefer the one with:

* less code
* fewer files
* fewer dependencies
* fewer abstractions
* fewer moving parts
* easier reasoning
* easier testing
* easier maintenance

Do not introduce a design pattern merely because it is available.

Simple code is preferred over clever code.

---

## 5. Minimal Changes

When implementing a feature or fixing a bug:

* Change only what is necessary.
* Preserve existing behavior.
* Follow existing project conventions.
* Avoid unrelated refactoring.
* Do not rewrite working code without a concrete reason.
* Do not rename unrelated variables/files/functions.
* Do not reorganize the project unnecessarily.

Keep the diff focused.

---

## 6. Dependencies

Before adding a dependency:

1. Check the standard library.
2. Check existing project dependencies.
3. Check whether the framework already provides the functionality.
4. Consider whether a small local implementation is simpler.

Only add a dependency when there is a clear benefit.

Never add a dependency merely for convenience if the project already has an adequate solution.

---

## 7. Abstractions

Do not create abstractions prematurely.

Avoid creating a:

* base class
* interface
* factory
* service layer
* wrapper
* manager
* generic utility
* configuration layer

unless it provides a concrete benefit.

A small amount of duplication is sometimes preferable to an unnecessary abstraction.

Create an abstraction when there is a demonstrated need, not merely because code "might be reused someday."

---

## 8. Error Handling

Handle realistic errors appropriately.

Do not add excessive defensive programming that makes straightforward code difficult to read.

Do not silently swallow errors.

When an error cannot reasonably occur under the project's established assumptions, do not add unnecessary checks solely for theoretical possibilities.

---

## 9. Comments

Prefer self-explanatory code.

Comments should explain **why**, not simply repeat **what** the code does.

Good reasons for comments include:

* non-obvious business rules
* algorithmic reasoning
* external limitations
* intentional workarounds
* surprising behavior

Avoid comments that merely translate code into English.

---

## 10. Performance

Do not prematurely optimize.

Prioritize:

1. Correctness
2. Simplicity
3. Readability
4. Performance when there is evidence it matters

For algorithms, however, choose an appropriate time and space complexity from the beginning when the constraints clearly require it.

Do not sacrifice a simple O(n) solution for unnecessary micro-optimizations.

---

## 11. Verification

After making a change:

* Check the affected code.
* Run relevant tests when available.
* Run the project's formatter/linter when appropriate.
* Check for compilation/type errors.
* Verify the requested behavior.
* Check that existing functionality remains intact.

Do not claim a change works without reasonable verification.

---

## 12. Avoid Scope Creep

If the user asks for:

> "Fix X"

do not automatically:

* refactor Y
* redesign Z
* update unrelated dependencies
* rename unrelated code
* rewrite surrounding architecture

If you discover an unrelated problem, mention it separately rather than silently expanding the scope.

---

## 13. Ask Before Major Architectural Changes

If the requested solution would require a significant architectural change, first determine whether the requirement genuinely requires it.

For small requirements, prefer a small implementation.

Do not turn a localized task into an architectural rewrite.

---

## 14. Decision Rule

When deciding between two valid implementations, prefer:

> **The smallest solution that is correct, maintainable, readable, and consistent with the existing codebase.**

Do not optimize for the number of abstractions.

Do not optimize for the number of files changed.

Do not optimize for cleverness.

Optimize for solving the actual problem with the least unnecessary complexity.

---

## Final Rule

Before writing new code, ask:

> **"Does this project already have something that can solve this?"**

Then ask:

> **"Can I solve this more simply?"**

Only after answering those questions should new code be introduced.
