/**
 * Constructs a message to display in the log.
 * @param message Desired phrase to summarize the error
 * @param vm Component instance that encountered the error
 * @param parent Parent to the faulting component
 */
function createMessage(message: string, vm?: any, parent?: any): string | void {
  if (parent) {
    vm = {
      $options: vm,
      $parent: parent,
      _isVue: true,
    }
  }

  if (vm) {
    vm.$_logged = vm.$_logged || []

    if (vm.$_logged.includes(message)) {
      return
    }

    vm.$_logged.push(message)
  }

  return `[Bureau] ${message}` + (vm ? componentTrace(vm) : '')
}

export function info(message: string, vm?: any, parent?: any): void {
  const wrapped = createMessage(message, vm, parent)
  wrapped != null && console.info(wrapped)
}

export function warn(message: string, vm?: any, parent?: any): void {
  const wrapped = createMessage(message, vm, parent)
  wrapped != null && console.warn(wrapped)
}

export function error(message: string, vm?: any, parent?: any): void {
  const wrapped = createMessage(message, vm, parent)
  wrapped != null && console.error(wrapped)
}

export function deprecate(original: string, replacement: string, vm?: any, parent?: any) {
  warn(`'${original}' is deprecated. Use '${replacement}' instead.`, vm, parent)
}

/**
 * The following is stolen from Vue's own internal debugging code.
 */
const classifyRE = /(?:^|[-_])(\w)/g
const classify = (str: string) => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '')

function formatComponentName(vm: any, includeFile?: boolean): string {
  if (vm.$root === vm) {
    return '<Root>'
  }

  const options =
    typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {}

  let name = options.name || options._componentTag
  const file = options.__file

  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/)
    name = match && match[1]
  }

  return (name ? `<${classify(name)}>` : `<Anonymous>`) + (file && includeFile !== false ? ` at ${file}` : '')
}

/**
 * Generates a component descendency trace for a target VM instance.
 * @param vm Component instance to trace
 */
/* tslint:disable */
function componentTrace(vm: any): string {
  if (vm._isVue && vm.$parent) {
    const tree = []
    let currentRecursiveSequence = 0

    while (vm) {
      if (tree.length > 0) {
        const last: any = tree[tree.length - 1]

        if (last.constructor === vm.constructor) {
          currentRecursiveSequence++
          vm = vm.$parent
          continue
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence]
          currentRecursiveSequence = 0
        }
      }

      tree.push(vm)
      vm = vm.$parent
    }

    return (
      '\n\nfound in\n\n' +
      tree
        .map(
          (vm, i) =>
            `${i === 0 ? '---> ' : ' '.repeat(5 + i * 2)}${
              Array.isArray(vm)
                ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
                : formatComponentName(vm)
            }`,
        )
        .join('\n')
    )
  } else {
    return `\n\n(found in ${formatComponentName(vm)})`
  }
  /* tslint:enable */
}
