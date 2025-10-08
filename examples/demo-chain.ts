/**
 * Byteflow - Custom Prompt Chain Demo
 *
 * Demonstrates multi-step prompt optimization with custom chains.
 */

import 'dotenv/config';
import { PromptChain } from '../src/services/prompt-chain.js';

async function main() {
  console.log('🔗 Byteflow - Custom Prompt Chain Demo\n');

  const chain = new PromptChain({
    apiKey: process.env.BYTEPLUS_API_KEY!,
    endpoint: process.env.BYTEPLUS_ENDPOINT!,
  });

  // Custom 3-step chain
  console.log('Executing custom 3-step chain\n');

  try {
    const result = await chain.execute('cyberpunk city', [
      {
        name: 'Style Analysis',
        systemPrompt: 'Analyze and expand the cyberpunk aesthetic with visual details',
        temperature: 0.8,
      },
      {
        name: 'Technical Details',
        systemPrompt: 'Add lighting, composition, and camera technical details',
        temperature: 0.6,
      },
      {
        name: 'Final Polish',
        systemPrompt: 'Polish for maximum image generation quality. Return ONLY the final prompt.',
        temperature: 0.5,
      },
    ]);

    console.log('✅ Chain completed!\n');
    console.log(`Final prompt: "${result.finalPrompt}"\n`);
    console.log(`Total tokens used: ${result.totalTokens}`);
    console.log(`Total duration: ${result.totalDuration}ms\n`);

    console.log('Step-by-step results:');
    result.steps.forEach((step, i) => {
      console.log(`\n${i + 1}. ${step.name} (${step.duration}ms, ${step.tokensUsed} tokens)`);
      console.log(`   Output: ${step.output.substring(0, 100)}...`);
    });
  } catch (error) {
    console.error('❌ Chain execution failed:', error);
  }

  console.log('\n🎉 Demo completed!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
