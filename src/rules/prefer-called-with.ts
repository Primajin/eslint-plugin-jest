import { createRule, getAccessorValue, parseJestFnCall } from './utils';

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description:
        'Suggest using `toBeCalledWith()` or `toHaveBeenCalledWith()`',
      recommended: false,
    },
    messages: {
      preferCalledWith: 'Prefer {{ matcherName }}With(/* expected args */)',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const jestFnCall = parseJestFnCall(node, context);

        if (jestFnCall?.type !== 'expect') {
          return;
        }

        const matcher = jestFnCall.members[jestFnCall.members.length - 1];

        if (
          !matcher ||
          jestFnCall.members.some(nod => getAccessorValue(nod) === 'not')
        ) {
          return;
        }

        const matcherName = getAccessorValue(matcher);

        if (['toBeCalled', 'toHaveBeenCalled'].includes(matcherName)) {
          context.report({
            data: { matcherName },
            messageId: 'preferCalledWith',
            node: matcher,
          });
        }
      },
    };
  },
});
