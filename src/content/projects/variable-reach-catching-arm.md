---
order: 2
title: VARIABLE-REACH CATCHING ARM
kicker: 3-AXIS ROBOTIC ARM
category: Robotics / Controls / Computer Vision
start: 2026-09
end: null
status:
  label: Milestone 0
  kind: wip
  detail: Active development — design stage
summary: >-
  A stationary three-axis robotic arm designed to catch various objects. Unlike a fixed-reach arm, its boom can telescope during interception
  so the robot stays short when possible and extends when the predicted catch
  point is farther away. This is currently still in development and planned to be presented in the upcoming UNLV Science Fair in March 2027.
why: >-
  I wanted to explore a robot whose physical geometry changes as part of the
  motion-planning problem. Instead of designing around one fixed reach, the
  arm has to decide both where to intercept the ball and how long the arm
  should be when it gets there.
built: >-
  Requirements, sizing calculations, part selection, bill of materials, the
  FreeCAD assembly and printable parts, a host-side simulation, the Teensy
  firmware skeleton, the host software skeleton, and the safety, calibration,
  testing, and bring-up documentation.
links:
  source:
    url: https://github.com/CEMAMI09/variable-reach-arm
    label: github.com/CEMAMI09/variable-reach-arm
tech:
  - Python
  - C++
  - Teensy 4.1
  - FreeCAD
  - Computer vision
  - Simulation
  - USB CDC serial
features:
  - items:
      - Computer vision ball detection
      - Ballistic trajectory estimation
      - Kalman-filter-style state estimation
      - Interception planner
      - Variable reach decision
      - Synchronized multi-axis trajectories
      - Teensy motor-control firmware
      - Hardware emergency stop
      - Firmware FAULT latch
      - Catcher retention mechanism
      - Future throw-back experiment
lists:
  - id: hardware
    title: Hardware
    items:
      - Teensy 4.1
      - Closed-loop NEMA23 / NEMA17 stepper motors
      - HTD / GT-style belt drives
      - Carbon-fiber boom tubes
      - Micro servo (catcher retention)
      - IR break-beam sensor
      - Emergency-stop motor-bus cutoff
  - id: software
    title: Software
    items:
      - Python host software
      - C++ firmware
      - FreeCAD parametric CAD
      - Computer vision
      - Simulation
      - USB CDC serial protocol
tables:
  - id: state
    title: System state
    columns: ['Symbol', 'Quantity', 'Design value']
    rows:
      - ['θ_y', 'Yaw angle', '—']
      - ['θ_p', 'Pitch angle', '—']
      - ['L', 'Extension length', '~500 mm stroke']
    caption: 'q = [θ_y, θ_p, L]. Target reach approximately 0.7–1.2 m.'
  - id: loads
    title: Design loads and actuators
    disclaimer: DESIGN-STAGE VALUES — NOT MEASURED
    rows:
      - ['Peak pitch load, with counterbalance', '11.9 N·m (design calculation)']
      - ['Yaw actuator', 'NEMA23, upgraded from NEMA17 after torque calculations']
      - ['Extension drive', 'Belt, chosen over a lead screw for extension speed']
  - id: budget
    title: Budget
    disclaimer: DESIGN-STAGE VALUES
    rows:
      - ['Target', 'Under $500']
      - ['Current BOM', '~$449']
  - id: targets
    title: Performance target
    disclaimer: TARGET — NOT YET MEASURED
    rows:
      - ['Catch success', '~70% within a defined underhand-toss volume']
      - ['Physical testing', 'Not started']
diagrams:
  - id: pipeline
    title: Catch pipeline
    direction: column
    steps:
      - label: Camera
      - label: Ball detection
        sub: computer vision
      - label: Trajectory estimation
        sub: ballistic model, Kalman-style filter
      - label: Intercept selection
        sub: reachable catch point
      - label: Reach decision
        sub: extension length L
      - label: Trajectory generation
        sub: synchronized θ_y, θ_p, L
      - label: Motor control
        sub: Teensy 4.1 firmware
      - label: Catch
        sub: retention mechanism
hero:
  src: /assets/variable-reach-arm/arm_image.svg
  alt: CAD assembly of the variable-reach catching arm with the boom extended
  caption: FreeCAD assembly
  treatment: none
  aspect: 1140 / 1062
gallery:
  - src: /assets/variable-reach-arm/arm_motion_catch_fast.gif
    alt: Animated CAD render of a fast catch sequence
    caption: cad/animations/arm_motion_catch_fast.gif
    treatment: gray
    aspect: 16 / 9
  - src: /assets/variable-reach-arm/assembly.png
    alt: FreeCAD assembly of the arm with the boom extended
    caption: cad/freecad/VariableReachArm.FCStd
    treatment: gray
    aspect: 16 / 10
  - src: /assets/variable-reach-arm/simulation.png
    alt: Plot from the host simulation showing a predicted trajectory and intercept point
    caption: simulation.run_demo
    treatment: gray
    aspect: 16 / 10
currentStatus: >-
  Current stage: design, simulation, CAD, firmware skeleton, host software
  skeleton, BOM, and bring-up documentation. Physical catch-rate results have
  not been measured yet.
seo:
  title: Variable-Reach Catching Arm — telescoping three-axis robot
  description: >-
    A stationary three-axis robotic arm with a telescoping boom, designed to
    catch various objects by choosing both where to intercept and how far to
    extend. Design-stage project by Cody Emami.
---

## Changing inertia

The pitch axis has to move a boom whose moment of inertia changes substantially as it extends. A controller tuned for the retracted arm behaves differently when the boom is out, and vice versa.

| Stage   | Approach                                       |
| ------- | ---------------------------------------------- |
| Initial | Conservative PD controller                     |
| Planned | Gain scheduling based on the extension state L |

## Counterbalance

The pitch torque needed to hold and accelerate the extended boom made a counterbalance necessary. With the counterbalance included, the peak pitch load works out to about 11.9 N·m in the design calculation.

## Yaw actuator

The first concept used a NEMA17 stepper on the yaw axis. Torque calculations against the extended-boom inertia did not leave enough margin, so the yaw axis was upgraded to a NEMA23.

## Extension mechanism

A lead screw was considered, but the extension has to happen inside the interception window, so extension speed matters more than the holding force a screw would provide. The boom is belt-driven.

## Planning

When more than one catch location is reachable, the interception cost should prefer the one that needs the smallest extension. Staying short keeps inertia low and leaves margin for the pitch controller; extending is the fallback for balls that would otherwise be out of reach.

## Safety

A hardware emergency stop cuts power to the motor bus independently of the firmware. Separately, the firmware carries a FAULT latch: once a fault is raised, motion commands are rejected until the fault is explicitly cleared.
